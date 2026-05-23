import { FundIconsMap } from "../images/FundIcons";
import type { SavingsFund } from "../types";

interface RenderIconProps {
    icon: string;
}

export const RenderIcon = ({ icon }: RenderIconProps) => {
    const Icon = FundIconsMap[icon as keyof typeof FundIconsMap]
        ?? FundIconsMap.Default;

    return <Icon/>
}