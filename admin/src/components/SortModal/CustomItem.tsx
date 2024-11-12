import { Box, Grid, Typography } from "@strapi/design-system";
import { Drag } from "@strapi/icons";
import { CSSProperties, forwardRef, HTMLAttributes } from "react"

export type TItem = {
    id: number
    title: string;
    subtitle: string;
}

type CustomItemProps = {
    item: TItem
    isOpacityEnabled?: boolean
    isDragging?: boolean
} & HTMLAttributes<HTMLDivElement>

const CustomItem = forwardRef<HTMLDivElement, CustomItemProps>(
    ({ item, isOpacityEnabled, isDragging, style, ...props }, ref) => {
        const styles: CSSProperties = {
            opacity: isOpacityEnabled ? "0.4" : "1",
            cursor: isDragging ? "grabbing" : "grab",
            lineHeight: "0.5",
            transform: isDragging ? "scale(1.05)" : "scale(1)",
            ...style
        }

        const ellipsis = (str: string, num: number = str.length, ellipsisStr = "...") =>
            str.length >= num
                ? str.slice(0, num >= ellipsisStr.length ? num - ellipsisStr.length : num) +
                ellipsisStr
                : str;

        item.title = ellipsis(item.title ?? "", 30);
        item.subtitle = ellipsis(item.subtitle ?? "", 30);

        return (
            <div ref={ref} style={styles} {...props}>
                <Box
                    style={{ zIndex: 10, cursor: 'all-scroll', userSelect: 'none' }}
                    background="neutral0"
                    hasRadius
                    shadow="filterShadow"
                    padding={2}
                >
                    <Grid.Root gap={1}>
                        <Grid.Item col={2} s={12}>
                            <Drag />
                        </Grid.Item>
                        <Grid.Item col={10} s={12}>
                            <Typography>
                                {item.title}
                                {item.subtitle}
                            </Typography>
                        </Grid.Item>
                    </Grid.Root>
                </Box>
            </div>
        )
    }
)

export default CustomItem;