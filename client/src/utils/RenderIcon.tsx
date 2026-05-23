import { FundIconsMap } from "../images/FundIcons";

interface RenderIconProps {
    icon: string;
}

export const RenderIcon = ({ icon }: RenderIconProps) => {
    const Icon = FundIconsMap[icon as keyof typeof FundIconsMap]
        ?? FundIconsMap.Default;

    return <Icon/>
}