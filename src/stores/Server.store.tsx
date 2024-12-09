import { action, computed, observable, ObservableMap } from "mobx";
import { Server } from "@furxus/types";

export default class ServerStore {
    @observable accessor initialServersLoaded = false;
    @observable accessor servers: ObservableMap<string, Server>;

    constructor() {
        this.servers = observable.map();
    }

    @action
    setInitialServersLoaded() {
        this.initialServersLoaded = true;
    }

    @action
    add(server: Server) {
        this.servers.set(server.id, server);
    }

    @action
    addAll(servers: Server[]) {
        servers.forEach((server) => this.add(server));
    }

    @action
    remove(server: Server) {
        this.servers.delete(server.id);
    }

    get(id: string) {
        return this.servers.get(id);
    }

    @computed
    get all() {
        return Array.from(this.servers.values());
    }

    @computed
    get count() {
        return this.servers.size;
    }
}
