export default logger;
declare namespace logger {
    let verbose: boolean;
    function configure(verbose: any): void;
    function title(msg: any): void;
    function log(msg: any): void;
    function warn(msg: any): void;
    function error(msg: any): void;
    function ip(protocol: any, address: any, port: any): void;
    function pluginStart(name: any): void;
    function pluginStarted(name: any): void;
    function pluginReady(name: any): void;
    function pluginErrored(name: any): void;
    function warnVersionDiscrepancies(clientRole: any, clientVersion: any, serverVersion: any): void;
    function deprecated(oldAPI: any, newAPI: any, lastSupportedVersion: any): void;
    function removed(oldAPI: any, hint: any, lastSupportedVersion: any): never;
    function httpsCertsInfos(httpsCertsInfos: any): void;
}
