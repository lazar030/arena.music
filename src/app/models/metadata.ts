import { Metatag } from './metatag';
import { Deserializable } from './deserializable';
export class Metadata implements Deserializable {
    id?: number;
    title?: string;
    tags?: Metatag[];

    deserialize(input: any) {
        Object.assign(this, input);
        this.tags.map((tag: Metatag) => new Metatag().deserialize(tag));
        return this;
    }
    isEmpty() {
        if (!this.id && !this.title) return true;
        return false;
    }
}
