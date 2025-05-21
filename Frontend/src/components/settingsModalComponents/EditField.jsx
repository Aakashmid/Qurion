import { useRef, useState } from "react"
import useClickOutside from "../../hooks/useClickOutside"
import { IoPencil } from "react-icons/io5"
import { GoPencil } from "react-icons/go";
import { useSidebar } from "../../context/SidebarContext";

const EditField = ({ title, value, onUpdate, inputType }) => {
    const { user } = useSidebar();
    const [isEditing, setIsEditing] = useState(false)
    const [currentValue, setCurrentValue] = useState(value)

    const handleSubmit = () => {
        onUpdate(title, value);
        setIsEditing(false);
    }

    const handleChange = (e) => {
        if (inputType === 'image') {
            setCurrentValue(e.target.files[0])
        } else {
            setCurrentValue(e.target.value)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
        else if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }

    const inputRef = useRef(null);
    useClickOutside(inputRef, () => setIsEditing(false))

    return (
        <>
            <div className="flex items-center   rounded-lg">
                <div className="flex-grow">
                    {!isEditing ? (
                        <>
                            <div className="h-[2.625rem] flex flex-col justify-center">
                                <h3 className="font-semibold text-sm text-white">{!isEditing && title}</h3>
                                <p className="text-sm text-gray-400">{value}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2 h-[2.625rem]">
                            {inputType === 'image' ? (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="border p-2 rounded bg-gray-700 text-white"
                                />
                            ) : (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={currentValue}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="border focus:outline-none p-2  rounded-lg border-none bg-gray-800 text-white w-full"
                                />
                            )}
                        </div>
                    )}                </div>
                {!isEditing && <>
                    <button className='px-3 py-1 text-sm border-gray-700 border hover:bg-gray-700 text-white rounded-lg transition-colors hidden sm:block' onClick={() => setIsEditing(true)}>
                        <span>Update {title}</span>
                    </button>
                    <button onClick={() => setIsEditing(true)} className="hover:bg-gray-700  rounded-full p-2 transition-colors hover:text-white sm:hidden ">
                        <GoPencil className="" />
                    </button>
                </>
                }

            </div>
        </>
    )
}

export default EditField;