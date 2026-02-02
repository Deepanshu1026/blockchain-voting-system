export default function VerifyID({ setHash }) {
    return (
        <input
            placeholder="Enter ID number"
            onBlur={(e) => setHash(e.target.value)}
        />
    );
}
