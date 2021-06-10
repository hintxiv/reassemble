import { useTheme } from '@nivo/core'
import { SliceTooltipProps } from '@nivo/line'
import React, { CSSProperties, memo } from 'react'
import { formatSeconds } from './formatSeconds'

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as CSSProperties['borderCollapse'],
}

const Chip = ({ key, color }: {key: React.Key, color: string}) => (
    <span key={key} style={{ display: 'block', borderRadius: '50%', width: '12px', height: '12px', background: color }} />
)

export const SliceTooltip = memo(({ slice }: SliceTooltipProps) => {
    const theme = useTheme()

    const rows = slice.points
        .sort((a, b) => (b.data.y as number) - (a.data.y as number)) // just trust me
        .filter((point, i) => slice.points.findIndex(other => point.serieId === other.serieId) === i)
        .map(point => [
            <Chip key="chip" color={point.serieColor} />,
            point.serieId,
            <strong key="value">{point.data.y}</strong>,
        ])

    return <div style={theme.tooltip.container}>
        <div>
            <table style={{ ...tableStyle, ...theme.tooltip.table }}>
                <thead>
                    <strong>{ formatSeconds(slice.points[0].data.x as number) }</strong>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((column, j) => (
                                <td key={j} style={theme.tooltip.tableCell }>
                                    {column}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
})
