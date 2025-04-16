import { Module } from "@nestjs/common";
import { R2Storage } from "./r2-storage";
import { EnvModule } from "../env/env.module";

@Module({
    imports: [EnvModule],
    providers: [R2Storage],
    exports: [R2Storage],
})

export class StorageModule { }