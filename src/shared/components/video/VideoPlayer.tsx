import { Post } from "@furxus/types";
import { useRef, useState } from "react";

import VideoFooter from "./VideoFooter";
import VideoSidebar from "./VideoSidebar";

const VideoPlayer = ({ post }: { post: Post }) => {
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const onVideoPress = () => {
        if (playing) {
            videoRef.current?.pause();
            setPlaying(false);
        } else {
            videoRef.current?.play();
            setPlaying(true);
        }
    };

    return (
        <div className="relative w-full h-[36rem] snap-start">
            <video
                className="rounded-xl object-fill w-full h-full border border-blue-500/60"
                loop
                ref={videoRef}
                onClick={onVideoPress}
                src={post.content.video}
            ></video>
            <VideoFooter post={post} />
            <VideoSidebar post={post} />
        </div>
    );
};

export default VideoPlayer;
