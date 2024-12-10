import { makeAutoObservable, observable } from "mobx";
import { Server } from "@furxus/types";

export default class ServerStore {
    initialServersLoaded = false;
    servers = observable.map<string, Server>();

    constructor() {
        makeAutoObservable(this);
    }

    setInitialServersLoaded() {
        this.initialServersLoaded = true;
    }

    add(server: Server) {
        this.servers.set(server.id, server);
    }

    addAll(servers: Server[]) {
        servers.forEach((server) => this.add(server));
    }

    remove(server: Server) {
        this.servers.delete(server.id);
    }

    get(id: string) {
        return this.servers.get(id);
    }

    get all() {
        return Array.from(this.servers.values());
    }

    get count() {
        return this.servers.size;
    }
}
