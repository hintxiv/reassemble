import { Line } from '@nivo/line'
import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { GearsetInfo } from './Result'

const firstColor = 'hsl(220, 100%, 60%)'
const secondColor = 'hsl(40, 100%, 60%)'

interface Point {
    x: number
    y: number
}

export interface GraphData {
    id: string | number
    data: Point[]
}

interface Props {
    gearsets: GearsetInfo[]
}

export class DamageGraph extends React.Component<Props> {
    private getColor = (line: GraphData) => {
        if (line.id === this.props.gearsets[0].name) {
            return firstColor
        }
        return secondColor
    }

    private getData = () => {
        return this.props.gearsets
            .reduce((data: GraphData[], gearset) => data = [...data, gearset.data], [])
    }

    render() {
        return <AutoSizer disableHeight>
            {({ width }) => (
                <div style={{ width: width + 'px' }}>
                    <Line
                        margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                        height={500}
                        width={width}
                        data={this.getData()}
                        animate={true}
                        isInteractive={true}
                        useMesh={true}
                        colors={this.getColor}
                        curve="basis"
                        enablePoints={false}
                        enableGridX={false}
                        enableGridY={false}
                        xScale={{ type: 'linear' }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: 5,
                            legend: 'DPS',
                            legendOffset: -60,
                            legendPosition: 'middle',
                        }}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: 10,
                            legend: '',
                            legendOffset: 0,
                            legendPosition: 'middle',
                            // Convert seconds to mm:ss
                            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                            format: (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed().padStart(2, '0')}`,
                        }}
                        legends={[{
                            anchor: 'top-right',
                            direction: 'column',
                            translateX: -20,
                            translateY: 0,
                            itemWidth: 80,
                            itemHeight: 25,
                            itemDirection: 'right-to-left',
                            symbolSize: 13,
                            symbolShape: 'circle',
                        }]}
                        theme={{
                            textColor: '#FFFFFF',
                            fontFamily: 'Roboto',
                            fontSize: 14,
                            axis: {
                                domain: {
                                    line: {
                                        stroke: '#FFFFFF',
                                        'strokeWidth': 2,
                                    },
                                },
                            },
                            grid: {
                                line: {
                                    stroke: '#FFFFFF',
                                    strokeWidth: 1,
                                },
                            },
                            tooltip: {
                                container: {
                                    color: 'black',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </AutoSizer>
    }
}
