import { Channel } from "@furxus/types";
import { ObservableMap, observable, action, computed } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default class ChannelStore {
    @observable accessor channels: ObservableMap<string, Channel>;
    @observable accessor channelInputs: ObservableMap<string, string>;

    constructor() {
        makePersistable(this, {
            name: "ChannelStore",
            properties: ["channels", "channelInputs"],
            storage: window.localStorage,
        });

        this.channels = observable.map();
        this.channelInputs = observable.map();
    }

    @action
    setInput(channelId: string, content: string) {
        this.channelInputs.set(channelId, content);
    }

    @action
    getInput(channelId: string) {
        return this.channelInputs.get(channelId) ?? "";
    }

    @action
    add(channel: Channel) {
        this.channels.set(channel.id, channel);
    }

    @action
    addAll(channels: Channel[]) {
        channels.forEach((channel) => this.add(channel));
    }

    @computed
    get all() {
        return Array.from(this.channels.values());
    }

    get(id: string) {
        return this.channels.get(id);
    }

    @computed
    get count() {
        return this.channels.size;
    }

    @action
    remove(channel: Channel) {
        this.channels.delete(channel.id);
    }

    has(id: string) {
        return this.channels.has(id);
    }

    // Implement this method
    sortPosition(_channels: Channel[]) {}
}
