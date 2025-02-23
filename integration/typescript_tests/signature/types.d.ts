// Code generated by scale-signature 0.4.5, DO NOT EDIT.
// output: local-example-latest-guest

import { Encoder, Decoder, Kind } from "@loopholelabs/polyglot"

export declare enum GenericEnum {
  FirstValue = 0,

  SecondValue = 1,

  DefaultValue = 2,

}export declare class EmptyModel {
  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): EmptyModel | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// EmptyModelWithDescription: Test Description
export declare class EmptyModelWithDescription {
  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): EmptyModelWithDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithSingleStringField {
  stringField: string;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithSingleStringField | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithSingleStringFieldAndDescription: Test Description
export declare class ModelWithSingleStringFieldAndDescription {
  stringField: string;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithSingleStringFieldAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithSingleInt32Field {
  int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithSingleInt32Field | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithSingleInt32FieldAndDescription: Test Description
export declare class ModelWithSingleInt32FieldAndDescription {
  int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithSingleInt32FieldAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithMultipleFields {
  stringField: string;

  int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithMultipleFields | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithMultipleFieldsAndDescription: Test Description
export declare class ModelWithMultipleFieldsAndDescription {
  stringField: string;

  int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithMultipleFieldsAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithEnum {
  enumField: GenericEnum;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEnum | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithEnumAndDescription: Test Description
export declare class ModelWithEnumAndDescription {
  enumField: GenericEnum;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEnumAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithEnumAccessor {
  #enumField: GenericEnum;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get enumField(): GenericEnum;

  set enumField(val: GenericEnum);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEnumAccessor | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithEnumAccessorAndDescription: Test Description
export declare class ModelWithEnumAccessorAndDescription {
  #enumField: GenericEnum;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get enumField(): GenericEnum;

  set enumField(val: GenericEnum);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEnumAccessorAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithMultipleFieldsAccessor {
  #stringField: string;

  #int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get stringField(): string;

  set stringField(val: string);

  get int32Field(): number;

  set int32Field (val: number);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithMultipleFieldsAccessor | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithMultipleFieldsAccessorAndDescription: Test Description
export declare class ModelWithMultipleFieldsAccessorAndDescription {
  #stringField: string;

  #int32Field: number;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get stringField(): string;

  set stringField(val: string);

  get int32Field(): number;

  set int32Field (val: number);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithMultipleFieldsAccessorAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithEmbeddedModels {
  embeddedEmptyModel: EmptyModel | undefined;

  embeddedModelArrayWithMultipleFieldsAccessor: Array<ModelWithMultipleFieldsAccessor>;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEmbeddedModels | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithEmbeddedModelsAndDescription: Test Description
export declare class ModelWithEmbeddedModelsAndDescription {
  embeddedEmptyModel: EmptyModel | undefined;

  embeddedModelArrayWithMultipleFieldsAccessor: Array<ModelWithMultipleFieldsAccessor>;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEmbeddedModelsAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithEmbeddedModelsAccessor {
  #embeddedEmptyModel: EmptyModel | undefined;

  #embeddedModelArrayWithMultipleFieldsAccessor: Array<ModelWithMultipleFieldsAccessor>;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get embeddedEmptyModel(): EmptyModel | undefined;

  set embeddedEmptyModel(val: EmptyModel | undefined);

  get embeddedModelArrayWithMultipleFieldsAccessor(): Array<ModelWithMultipleFieldsAccessor>;

  set EmbeddedModelArrayWithMultipleFieldsAccessor(val: Array<ModelWithMultipleFieldsAccessor>);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEmbeddedModelsAccessor | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

// ModelWithEmbeddedModelsAccessorAndDescription: Test Description
export declare class ModelWithEmbeddedModelsAccessorAndDescription {
  #embeddedEmptyModel: EmptyModel | undefined;

  #embeddedModelArrayWithMultipleFieldsAccessor: Array<ModelWithMultipleFieldsAccessor>;

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  get embeddedEmptyModel(): EmptyModel | undefined;

  set embeddedEmptyModel(val: EmptyModel | undefined);

  get embeddedModelArrayWithMultipleFieldsAccessor(): Array<ModelWithMultipleFieldsAccessor>;

  set EmbeddedModelArrayWithMultipleFieldsAccessor(val: Array<ModelWithMultipleFieldsAccessor>);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithEmbeddedModelsAccessorAndDescription | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

export declare class ModelWithAllFieldTypes {
  modelField: EmptyModel | undefined;

  modelArrayField: Array<EmptyModel>;

  stringField: string;

  stringArrayField: string[];

  stringMapField: Map<string, string>;

  stringMapFieldEmbedded: Map<string, EmptyModel>;

  int32Field: number;

  int32ArrayField: number[];

  int32MapField: Map<number, number>;

  int32MapFieldEmbedded: Map<number, EmptyModel>;

  int64Field: bigint;

  int64ArrayField: bigint[];

  int64MapField: Map<bigint, bigint>;

  int64MapFieldEmbedded: Map<bigint, EmptyModel>;

  uint32Field: number;

  uint32ArrayField: number[];

  uint32MapField: Map<number, number>;

  uint32MapFieldEmbedded: Map<number, EmptyModel>;

  uint64Field: bigint;

  uint64ArrayField: bigint[];

  uint64MapField: Map<bigint, bigint>;

  uint64MapFieldEmbedded: Map<bigint, EmptyModel>;

  float32Field: number;

  float32ArrayField: number[];

  float64Field: number;

  float64ArrayField: number[];

  enumField: GenericEnum;

  enumArrayField: GenericEnum[];

  enumMapField: Map<GenericEnum, string>;

  enumMapFieldEmbedded: Map<GenericEnum, EmptyModel>;

  bytesField: Uint8Array;

  bytesArrayField: Uint8Array[];

  boolField: boolean;

  boolArrayField: boolean[];

  /**
  * @throws {Error}
  */
  constructor (decoder?: Decoder);

  /**
  * @throws {Error}
  */
  encode (encoder: Encoder);

  /**
  * @throws {Error}
  */
  static decode (decoder: Decoder): ModelWithAllFieldTypes | undefined;

  /**
  * @throws {Error}
  */
  static encode_undefined (encoder: Encoder);
}

