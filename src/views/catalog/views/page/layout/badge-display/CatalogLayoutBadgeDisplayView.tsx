import { StringDataType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { InventoryBadgesUpdatedEvent } from '../../../../../../events';
import { InventoryBadgesRequestEvent } from '../../../../../../events/inventory/InventoryBadgesRequestEvent';
import { dispatchUiEvent, useUiEvent } from '../../../../../../hooks';
import { NitroCardGridItemView } from '../../../../../../layout/card/grid/item/NitroCardGridItemView';
import { NitroCardGridView } from '../../../../../../layout/card/grid/NitroCardGridView';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { GetOfferName } from '../../../../common/CatalogUtilities';
import { useCatalogContext } from '../../../../context/CatalogContext';
import { CatalogRoomPreviewerView } from '../../../catalog-room-previewer/CatalogRoomPreviewerView';
import { CatalogPageOffersView } from '../../offers/CatalogPageOffersView';
import { CatalogPurchaseView } from '../../purchase/CatalogPurchaseView';
import { CatalogLayoutBadgeDisplayViewProps } from './CatalogLayoutBadgeDisplayView.types';

export const CatalogLayoutBadgeDisplayView: FC<CatalogLayoutBadgeDisplayViewProps> = props =>
{
    const { roomPreviewer = null, pageParser = null } = props;
    const { catalogState = null, dispatchCatalogState = null } = useCatalogContext();
    const { activeOffer = null } = catalogState;
    const [ currentBadge, setCurrentBadge ] = useState<string>(null);
    const [ badges, setBadges ] = useState<string[]>([]);

    const product = ((activeOffer && activeOffer.products[0]) || null);

    const onInventoryBadgesUpdatedEvent = useCallback((event: InventoryBadgesUpdatedEvent) =>
    {
        console.log(event);
        setBadges(event.badges);
    }, []);

    useUiEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, onInventoryBadgesUpdatedEvent);

    const badgeElements = useMemo(() =>
    {
        return badges.map(code =>
            {
                return (
                    <NitroCardGridItemView key={ code } itemActive={ (currentBadge === code) } onMouseDown={ event => setCurrentBadge(code) }> 
                        <BadgeImageView badgeCode={ code } />
                    </NitroCardGridItemView>
                );
            });
    }, [ badges, currentBadge ]);

    useEffect(() =>
    {
        dispatchUiEvent(new InventoryBadgesRequestEvent(InventoryBadgesRequestEvent.REQUEST_BADGES));
    }, []);

    useEffect(() =>
    {
        if(!currentBadge || !activeOffer) return;

        const stuffData = new StringDataType();

        stuffData.setValue([ null, currentBadge ]);

        roomPreviewer.updateObjectStuffData(stuffData);
    }, [ currentBadge, activeOffer, roomPreviewer ]);

    return (
        <div className="row h-100 nitro-catalog-layout-badge-display">
            <div className="d-flex flex-column col-7 h-100">
                <CatalogPageOffersView offers={ pageParser.offers } />
                <div className="d-flex mt-2">
                    <NitroCardGridView className="inventory-badge-grid">
                        { badgeElements }
                    </NitroCardGridView>
                </div>
            </div>
            { product &&
                <div className="position-relative d-flex flex-column col">
                    <CatalogRoomPreviewerView roomPreviewer={ roomPreviewer } height={ 140 } />
                    <div className="fs-6 text-black mt-1 overflow-hidden">{ GetOfferName(activeOffer) }</div>
                    <CatalogPurchaseView offer={ activeOffer } pageId={ pageParser.pageId } extra={ 'Bill	22-7-2021	ADM' } />
                </div> }
        </div>
    );
}