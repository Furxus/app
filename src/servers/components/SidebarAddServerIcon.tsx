import { BiPlus } from "react-icons/bi";
import { useState } from "react";

import CreateServerDialog from "./CreateServerDialog";
import JoinServerDialog from "./JoinServerDialog";
import IconButton from "@mui/material/IconButton";

const SidebarAddServerButton = () => {
    const [visible, setVisible] = useState(false);

    const [modalType, setModalType] = useState<"create" | "join">("join");

    return (
        <>
            {modalType === "create" && (
                <CreateServerDialog
                    visible={visible}
                    setVisible={setVisible}
                    setModalType={setModalType}
                />
            )}
            {modalType === "join" && (
                <JoinServerDialog
                    visible={visible}
                    setVisible={setVisible}
                    setModalType={setModalType}
                />
            )}
            <IconButton
                onClick={() => {
                    setModalType("join");
                    setVisible(true);
                }}
                color="success"
                size="large"
                sx={{
                    border: "1px solid #4caf50",
                }}
            >
                <BiPlus />
            </IconButton>
        </>
    );
};

export default SidebarAddServerButton;
