/*
        Copyright 2022 Loophole Labs

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

import {V1BetaSchema} from "../scalefunc/scalefunc";
import { New as NewScale } from "../scale";

import fs from "fs";
import {Config} from "../config";

import { New as NewExtension, Interface, Example, Stringval } from "./typescript_ext_tests/host_extension";

import { New as NewSignature, Signature } from "./typescript_tests/host_signature";
import {TextDecoder, TextEncoder} from "util";

window.TextEncoder = TextEncoder;
window.TextDecoder = TextDecoder as typeof window["TextDecoder"];

class ExampleImpl implements Example {
  public Hello(p: Stringval): Stringval {
    let sv = new Stringval();
    sv.value = "Return Hello";
    return sv;
  }
}

class ExtImpl implements Interface {
  public New(p: Stringval): Example {
    return new ExampleImpl();
  }
  public World(p: Stringval): Stringval {
    let sv = new Stringval();
    sv.value = "Return World";
    return sv;
  }
}

test("test-ext-typescript-host-rust-guest", async () => {
    const impl = new ExtImpl();
    const ex = NewExtension(impl);

    const file = fs.readFileSync(process.cwd() + "/integration/rust.scale")
    const sf = V1BetaSchema.Decode(file);
    const config = new Config<Signature>(NewSignature).WithFunction(sf).WithStdout(console.log).WithStderr(console.error).WithExtension(ex);
    const s = await NewScale(config);

    const i = await s.Instance();
    const sig = NewSignature();

    await i.Run(sig);

    expect(sig.context.stringField).toBe("This is a Rust Function. Extension New().Hello()=Return Hello World()=Return World");
});

test("test-ext-typescript-host-golang-guest", async () => {
    
    const impl = new ExtImpl();
    const ex = NewExtension(impl);

    const file = fs.readFileSync(process.cwd() + "/integration/golang.scale")
    const sf = V1BetaSchema.Decode(file);
    const config = new Config<Signature>(NewSignature).WithFunction(sf).WithStdout(console.log).WithStderr(console.error).WithExtension(ex)
    const s = await NewScale(config);

    const i = await s.Instance();
    const sig = NewSignature();

    await i.Run(sig);

    expect(sig.context.stringField).toBe("This is a Golang Function. Extension New().Hello()=Return Hello World()=Return World");
});
