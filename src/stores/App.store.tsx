import { Server, Channel } from "@furxus/types";
import { action, observable } from "mobx";
import ChannelStore from "./Channel.store";
import ServerStore from "./Server.store";
import AppModeStore from "./AppMode.store";

export default class AppStore {
    @observable accessor appMode = new AppModeStore();
    @observable accessor servers = new ServerStore();
    @observable accessor channels = new ChannelStore();

    @observable accessor activeServer: Server | null = null;
    @observable accessor activeServerId: string | null | undefined = null;
    @observable accessor activeChannel: Channel | null = null;
    @observable accessor activeChannelId: string | undefined = undefined;

    @action
    setActiveServerId(id: string | undefined) {
        this.activeServerId = id;

        this.activeServer = (id ? this.servers.get(id) : null) ?? null;
    }

    @action
    setActiveChannelId(id: string | undefined) {
        this.activeChannelId = id;

        this.activeChannel = (id ? this.channels.get(id) : null) ?? null;
    }
}
