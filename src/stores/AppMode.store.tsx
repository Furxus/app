import { AppModes } from "@/types";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export default class AppModeStore {
    mode: AppModes | null = null;

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, {
            name: "AppModeStore",
            properties: ["mode"],
            storage: window.localStorage,
        });
    }

    set(appMode: AppModes | null) {
        this.mode = appMode;
    }

    get current() {
        return this.mode;
    }

    switch(appMode: AppModes, navigate: (appMode: AppModes) => void) {
        this.set(appMode);
        navigate(appMode);
    }
}
