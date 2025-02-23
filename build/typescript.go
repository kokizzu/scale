/*
	Copyright 2023 Loophole Labs

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		   http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

package build

import (
	"encoding/hex"
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"

	"github.com/loopholelabs/scale/extension"

	"github.com/evanw/esbuild/pkg/api"

	"github.com/loopholelabs/scale/compile/typescript"
	"github.com/loopholelabs/scale/compile/typescript/builder"

	"github.com/loopholelabs/scale/scalefile"
	"github.com/loopholelabs/scale/scalefunc"
	"github.com/loopholelabs/scale/signature"
	"github.com/loopholelabs/scale/storage"
)

var (
	ErrNoNPM = errors.New("npm not found in PATH. Please install npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm")
)

const (
	tsConfig = `
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "types": ["node"]
  },
}`
)

type LocalTypescriptOptions struct {
	// Stdout is the output writer for the various build commands
	Stdout io.Writer

	// Scalefile is the scalefile to be built
	Scalefile *scalefile.Schema

	// SignatureSchema is the schema of the signature
	//
	// Note: The SignatureSchema is only used to embed type information into the scale function,
	// and not as part of the build process
	SignatureSchema *signature.Schema

	// ExtensionSchemas are the schemas of the extensions. The array must be in the same order as the extensions
	// are defined in the scalefile
	//
	// Note: The ExtensionSchemas are only used to embed extension information into the scale function,
	// and not as part of the build process
	ExtensionSchemas []*extension.Schema

	// SourceDirectory is the directory where the source code is located
	SourceDirectory string

	// Storage is the storage handler to use for the build
	Storage *storage.BuildStorage

	// Release is whether to build in release mode
	Release bool

	// Target is the target to build for
	Target Target

	// NPMBin is the optional path to the npm binary
	NPMBin string
}

func LocalTypescript(options *LocalTypescriptOptions) (*scalefunc.V1BetaSchema, error) {
	var err error
	if options.NPMBin != "" {
		stat, err := os.Stat(options.NPMBin)
		if err != nil {
			return nil, fmt.Errorf("unable to find npm binary %s: %w", options.NPMBin, err)
		}
		if !(stat.Mode()&0111 != 0) {
			return nil, fmt.Errorf("npm binary %s is not executable", options.NPMBin)
		}
	} else {
		options.NPMBin, err = exec.LookPath("npm")
		if err != nil {
			return nil, ErrNoNPM
		}
	}

	if len(options.ExtensionSchemas) != len(options.Scalefile.Extensions) {
		return nil, fmt.Errorf("number of extension schemas does not match number of extensions in scalefile")
	}

	if !filepath.IsAbs(options.SourceDirectory) {
		options.SourceDirectory, err = filepath.Abs(options.SourceDirectory)
		if err != nil {
			return nil, fmt.Errorf("unable to parse source directory: %w", err)
		}
	}

	_, err = os.Stat(options.SourceDirectory)
	if err != nil {
		return nil, fmt.Errorf("unable to find source directory %s: %w", options.SourceDirectory, err)
	}

	cmd := exec.Command(options.NPMBin, "install")
	cmd.Dir = options.SourceDirectory
	cmd.Stderr = options.Stdout
	cmd.Stdout = options.Stdout
	cmd.Env = os.Environ()
	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("unable to npm install the dependencies of the scale function: %w", err)
	}

	packageJSONData, err := os.ReadFile(path.Join(options.SourceDirectory, "package.json"))
	if err != nil {
		return nil, fmt.Errorf("unable to read Cargo.toml file: %w", err)
	}

	manifest, err := typescript.ParseManifest(packageJSONData)
	if err != nil {
		return nil, fmt.Errorf("unable to parse Cargo.toml file: %w", err)
	}

	if !manifest.HasDependency("signature") {
		return nil, fmt.Errorf("signature dependency not found in package.json")
	}

	signatureInfo := new(typescript.SignatureInfo)

	signatureInfo.ImportPath = manifest.GetDependency("signature")
	if signatureInfo.ImportPath == "" {
		return nil, fmt.Errorf("unable to parse signature dependency in package.json")
	}

	switch options.Scalefile.Signature.Organization {
	case "local":
		signatureInfo.Local = true
		if !strings.HasPrefix(signatureInfo.ImportPath, "file:") {
			return nil, fmt.Errorf("scalefile's signature block does not match package.json: signature import path is %s for a local signature", signatureInfo.ImportPath)
		}
		signatureInfo.ImportPath = strings.TrimPrefix(signatureInfo.ImportPath, "file:")
		if !filepath.IsAbs(signatureInfo.ImportPath) {
			signatureInfo.ImportPath, err = filepath.Abs(path.Join(options.SourceDirectory, signatureInfo.ImportPath))
			if err != nil {
				return nil, fmt.Errorf("unable to parse signature dependency path: %w", err)
			}
		}
	default:
		signatureInfo.Local = false
		if !(strings.HasPrefix(signatureInfo.ImportPath, "http://") || strings.HasPrefix(signatureInfo.ImportPath, "https://")) {
			return nil, fmt.Errorf("scalefile's signature block does not match package.json: signature import path is %s for a signature with organization %s", signatureInfo.ImportPath, options.Scalefile.Signature.Organization)
		}
	}

	functionInfo := &typescript.FunctionInfo{
		PackageName: strings.ToLower(options.Scalefile.Name),
		ImportPath:  options.SourceDirectory,
	}

	build, err := options.Storage.Mkdir()
	if err != nil {
		return nil, fmt.Errorf("unable to create build directory: %w", err)
	}
	defer func() {
		_ = options.Storage.Delete(build)
	}()

	var target api.Platform
	switch options.Target {
	case WASITarget:
		target = api.PlatformNode
	case WASMTarget:
		target = api.PlatformBrowser
	default:
		return nil, fmt.Errorf("unknown build target %d", options.Target)
	}

	result := api.Build(api.BuildOptions{
		Bundle:      true,
		Platform:    target,
		Format:      api.FormatCommonJS,
		Define:      map[string]string{"global": "globalThis"},
		TsconfigRaw: tsConfig,
		EntryPoints: []string{path.Join(options.SourceDirectory, "index.ts")},
	})

	if len(result.Errors) > 0 {
		var errString strings.Builder
		for _, err := range result.Errors {
			errString.WriteString(err.Text)
			errString.WriteRune('\n')
		}
		return nil, fmt.Errorf("unable to compile scale function source using esbuild: %s", errString.String())
	}

	functionDir := path.Join(build.Path, "function")
	err = os.MkdirAll(functionDir, 0755)
	if err != nil {
		return nil, fmt.Errorf("unable to create function dist directory: %w", err)
	}

	err = os.WriteFile(path.Join(functionDir, "index.js"), result.OutputFiles[0].Contents, 0644)
	if err != nil {
		return nil, fmt.Errorf("unable to write index.js file for function dist: %w", err)
	}

	packageJSONFile, err := typescript.GenerateTypescriptPackageJSON(signatureInfo)
	if err != nil {
		return nil, fmt.Errorf("unable to generate package.json file: %w", err)
	}

	indexFile, err := typescript.GenerateTypescriptIndex(options.Scalefile, functionInfo)
	if err != nil {
		return nil, fmt.Errorf("unable to generate index.ts file: %w", err)
	}

	compilePath := path.Join(build.Path, "compile")

	err = os.MkdirAll(compilePath, 0755)
	if err != nil {
		return nil, fmt.Errorf("unable to create compile directory: %w", err)
	}

	err = os.WriteFile(path.Join(compilePath, "package.json"), packageJSONFile, 0644)
	if err != nil {
		return nil, fmt.Errorf("unable to create package.json file: %w", err)
	}

	err = os.WriteFile(path.Join(compilePath, "index.ts"), indexFile, 0644)
	if err != nil {
		return nil, fmt.Errorf("unable to create index.ts file: %w", err)
	}

	cmd = exec.Command(options.NPMBin, "install")
	cmd.Dir = compilePath
	cmd.Stderr = options.Stdout
	cmd.Stdout = options.Stdout
	cmd.Env = os.Environ()
	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("unable to compile scale function and update npm: %w", err)
	}

	result = api.Build(api.BuildOptions{
		Bundle:      true,
		Platform:    target,
		Format:      api.FormatCommonJS,
		Define:      map[string]string{"global": "globalThis"},
		TsconfigRaw: tsConfig,
		EntryPoints: []string{path.Join(compilePath, "index.ts")},
	})

	if len(result.Errors) > 0 {
		var errString strings.Builder
		for _, err := range result.Errors {
			errString.WriteString(err.Text)
			errString.WriteRune('\n')
		}
		return nil, fmt.Errorf("unable to compile scale function compiler using esbuild: %s", errString.String())
	}

	jsBuilderBinary := path.Join(build.Path, "js_builder")
	err = os.WriteFile(path.Join(build.Path, "js_builder"), builder.BuilderExecutable, 0770)
	if err != nil {
		return nil, fmt.Errorf("unable to write js_builder executable: %w", err)
	}

	cmd = exec.Command(jsBuilderBinary, "-o", path.Join(build.Path, "scale.wasm"))
	cmd.Stdin = strings.NewReader(string(result.OutputFiles[0].Contents))
	cmd.Stderr = options.Stdout
	cmd.Stdout = options.Stdout
	cmd.Env = os.Environ()
	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("unable to compile scale function using js_builder: %w", err)
	}

	data, err := os.ReadFile(path.Join(build.Path, "scale.wasm"))
	if err != nil {
		return nil, fmt.Errorf("unable to read compiled wasm file: %w", err)
	}

	signatureHash, err := options.SignatureSchema.Hash()
	if err != nil {
		return nil, fmt.Errorf("unable to hash signature: %w", err)
	}

	sig := scalefunc.V1BetaSignature{
		Name:         options.Scalefile.Signature.Name,
		Organization: options.Scalefile.Signature.Organization,
		Tag:          options.Scalefile.Signature.Tag,
		Schema:       options.SignatureSchema,
		Hash:         hex.EncodeToString(signatureHash),
	}

	exts := make([]scalefunc.V1BetaExtension, len(options.Scalefile.Extensions))
	for i, ext := range options.Scalefile.Extensions {
		extensionHash, err := options.ExtensionSchemas[i].Hash()
		if err != nil {
			return nil, fmt.Errorf("unable to hash extension %s: %w", ext.Name, err)
		}

		exts[i] = scalefunc.V1BetaExtension{
			Name:         ext.Name,
			Organization: ext.Organization,
			Tag:          ext.Tag,
			Schema:       options.ExtensionSchemas[i],
			Hash:         hex.EncodeToString(extensionHash),
		}
	}

	return &scalefunc.V1BetaSchema{
		Name:       options.Scalefile.Name,
		Tag:        options.Scalefile.Tag,
		Signature:  sig,
		Extensions: exts,
		Language:   scalefunc.TypeScript,
		Manifest:   packageJSONData,
		Stateless:  options.Scalefile.Stateless,
		Function:   data,
	}, nil

}
