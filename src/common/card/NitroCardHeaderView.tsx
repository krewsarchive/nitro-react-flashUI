import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { Base, Column, ColumnProps, Flex } from '..';
import { Text } from '../../common';

interface NitroCardHeaderViewProps extends ColumnProps
{
    headerText: string;
    noCloseButton?: boolean;
    onCloseClick: (event: MouseEvent) => void;
}

export const NitroCardHeaderView: FC<NitroCardHeaderViewProps> = props =>
{
    const { headerText = null, noCloseButton = false, onCloseClick = null, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'drag-handler', 'container-fluid', 'nitro-card-header' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    const onMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) =>
    {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }, []);

    return (
        <Column center position="relative" classNames={ getClassNames } { ...rest }>
            <Flex fullWidth className="nitro-card-header-holder">
            <span className="nitro-card-header-text">{ headerText }</span>
                <Base position="absolute" className="end-2 nitro-card-header-close" onMouseDownCapture={ onMouseDown } onClick={ onCloseClick }>
                </Base>
            </Flex>
        </Column>
    );
}
