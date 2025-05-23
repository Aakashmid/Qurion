import { IoClose, IoReload } from "react-icons/io5";

export default function SomethinkWrongErr() {
    return (

        <div className="text-red-500 w-fit bg-gray-800 flex items-center border border-red-500 rounded-xl px-6 py-4 justify-between">
            <button
                className="hover:text-red-400 transition-colors"
                onClick={() => window.location.reload()}
                title="Retry"
            >
                <IoReload className="h-5 w-auto" />
            </button>
            <p className="mx-4 text-[16px]">Something went wrong! Please retry.</p>
            <button
                className="hover:text-red-400 transition-colors"
                onClick={() => clearError()}
                title="Dismiss"
            >
                <IoClose className="h-6 w-auto" />
            </button>
        </div>

    )
}
