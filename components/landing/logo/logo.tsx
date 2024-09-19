import Image from "next/image"

const Logo = ({ ...props }) => (
    <Image
        src="/images/split.svg"
        alt="Split logo"
        {...props}
        width={86}
        height={48}
        priority
    />
)
export default Logo
