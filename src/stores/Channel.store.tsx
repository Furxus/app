import { Channel } from "@furxus/types";
import { observable, makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default class ChannelStore {
    channels = observable.map<string, Channel>();
    inputs = observable.map<string, string>();

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: "ChannelStore",
            properties: ["channels", "inputs"],
            storage: window.localStorage,
        });
    }

    setInput(channelId: string, content: string) {
        this.inputs.set(channelId, content);
    }

    getInput(channelId: string) {
        return this.inputs.get(channelId) ?? "";
    }

    add(channel: Channel) {
        this.channels.set(channel.id, channel);
    }

    addAll(channels: Channel[]) {
        channels.forEach((channel) => this.add(channel));
    }

    get all() {
        return Array.from(this.channels.values());
    }

    get(id: string) {
        return this.channels.get(id);
    }

    get count() {
        return this.channels.size;
    }

    remove(channel: Channel) {
        this.channels.delete(channel.id);
    }

    has(id: string) {
        return this.channels.has(id);
    }

    // Implement this method
    sortPosition(_channels: Channel[]) {}
}
