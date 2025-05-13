import { IoClose } from "react-icons/io5";
import { useState } from "react";
import { RiWhatsappLine, RiFacebookBoxLine, RiTwitterLine, RiLinkedinBoxLine } from "react-icons/ri";

export default function ShareModal({ conv_token, toggleShareModal }) {
    const [Copied, setCopied] = useState(false);
    const shareLink = `${import.meta.env.VITE_FRONTEND_URL}/share/c/${conv_token}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const shareToSocialMedia = (platform) => {
        const text = "Check out this conversation!";
        let url = "";

        switch (platform) {
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`;
                break;
            case "linkedin":
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`;
                break;
            case "whatsapp":
                url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareLink)}`;
                break;
        }
        window.open(url, "_blank");
    };

    return (
            <div className="bg-gray-900 px-5 pt-8 pb-8 relative rounded-xl   text-white ">
                <div className="text-center">
                    <h2 className="text-xl font-semibold">Share Conversation</h2>
                </div>
                <button onClick={toggleShareModal} className="absolute right-2 top-2 hover:text-white text-gray-300 transition-colors">
                    <IoClose className="h-6 w-auto" />
                </button>
                <div className="mt-6 space-y-6">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 bg-gray-800 px-4 py-2 rounded-lg text-sm focus:outline-none"
                        />
                        <button onClick={copyToClipboard} className="bg-purple hover:bg-violet-600 px-4 py-2 rounded-lg transition-colors">
                            {Copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => shareToSocialMedia("facebook")} className="bg-[#1877F2] hover:bg-[#1864D2] py-2 rounded-lg transition-colors">
                            <RiFacebookBoxLine className="h-7 w-auto mx-auto" />
                        </button>
                        <button onClick={() => shareToSocialMedia("twitter")} className="bg-[#1DA1F2] hover:bg-[#1A8CD8] py-2 rounded-lg transition-colors">
                            <RiTwitterLine className="h-7 w-auto mx-auto" />
                        </button>
                        <button onClick={() => shareToSocialMedia("linkedin")} className="bg-[#0A66C2] hover:bg-[#094EA3] py-2 rounded-lg transition-colors">
                            <RiLinkedinBoxLine className="h-7 w-auto mx-auto" />
                        </button>
                        <button onClick={() => shareToSocialMedia("whatsapp")} className="bg-[#25D366] py-2 rounded-lg transition-colors">
                            <RiWhatsappLine className="h-7 w-auto mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
    );
}