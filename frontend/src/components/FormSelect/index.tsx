import Select from "react-select";

export default function FormSelect(props: any) {

    const {
        className,
        validation,
        invalid = "false",
        dirty = "false",
        onTurnDirty,
        placeholder = "Select...",
        ...selectProps
    } = props;

    function handleBlur() {
        onTurnDirty(props.name);
    }

    return (
        <div
            className={className}
            data-invalid={invalid}
            data-dirty={dirty}
        >
            <Select
                {...selectProps}
                placeholder={placeholder}
                onBlur={handleBlur}
            />
        </div>
    )
}
