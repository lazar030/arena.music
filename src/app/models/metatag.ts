import { Deserializable } from './deserializable';

export class Metatag implements Deserializable{
    type?: string;
    name?: string;
    property?: string;
    content?: string;

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}
