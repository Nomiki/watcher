export interface IConfiguration {
    type?: string;
    extensionsToWatch?: string[];
}

export interface IGenericConfiguration extends IConfiguration {
    runConfig: {
        cmd: string;
        args: string[];
    };
}

export interface IDotnetConfiguration extends IConfiguration {
    runConfig?: {
        csprojFile?: string;
    };
}
