import { Server, Channel } from "@furxus/types";
import { makeAutoObservable } from "mobx";
import ChannelStore from "./Channel.store";
import ServerStore from "./Server.store";
import AppModeStore from "./AppMode.store";

export default class AppStore {
    appMode = new AppModeStore();
    servers = new ServerStore();
    channels = new ChannelStore();

    activeServer: Server | null = null;
    activeServerId: string | null | undefined = null;
    activeChannel: Channel | null = null;
    activeChannelId: string | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setActiveServerId(id: string | undefined) {
        this.activeServerId = id;

        this.activeServer = (id ? this.servers.get(id) : null) ?? null;
    }

    setActiveChannelId(id: string | undefined) {
        this.activeChannelId = id;

        this.activeChannel = (id ? this.channels.get(id) : null) ?? null;
    }
}
