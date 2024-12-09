import { AppModes } from "@/types";
import { action, observable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default class AppModeStore {
    @observable accessor mode: AppModes = "servers";

    constructor() {
        makePersistable(this, {
            name: "AppModeStore",
            properties: ["mode"],
            storage: window.localStorage,
        });
    }

    @action
    set(appMode: AppModes) {
        this.mode = appMode;
    }

    @action
    get current() {
        return this.mode;
    }

    @action
    switch(appMode: AppModes, navigate: (appMode: AppModes) => void) {
        this.set(appMode);
        navigate(appMode);
    }
}
