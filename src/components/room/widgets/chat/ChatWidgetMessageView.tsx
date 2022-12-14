import { RoomChatSettings } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { ChatBubbleMessage } from './common/ChatBubbleMessage';

interface ChatWidgetMessageViewProps
{
    chat: ChatBubbleMessage;
    makeRoom: (chat: ChatBubbleMessage) => void;
    onChatClicked: (chat: ChatBubbleMessage) => void;
    bubbleWidth?: number;
}

export const ChatWidgetMessageView: FC<ChatWidgetMessageViewProps> = props =>
{
    const { chat = null, makeRoom = null, onChatClicked = null, bubbleWidth = RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL } = props;
    const [ isVisible, setIsVisible ] = useState(false);
    const elementRef = useRef<HTMLDivElement>();

    const getBubbleWidth = useMemo(() =>
    {
        switch(bubbleWidth)
        {
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_NORMAL:
                return 350;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_THIN:
                return 240;
            case RoomChatSettings.CHAT_BUBBLE_WIDTH_WIDE:
                return 2000;
        }
    }, [ bubbleWidth ]);

    useEffect(() =>
    {
        const element = elementRef.current;

        if(!element) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;

        chat.width = width;
        chat.height = height;
        chat.elementRef = element;
        
        let left = chat.left;
        let top = chat.top;

        if(!left && !top)
        {
            left = (chat.location.x - (width / 2));
            top = (element.parentElement.offsetHeight - height);
            
            chat.left = left;
            chat.top = top;
        }

        if(!chat.visible)
        {
            makeRoom(chat);

            chat.visible = true;
        }

        return () =>
        {
            chat.elementRef = null;
        }
    }, [ elementRef, chat, makeRoom ]);

    useEffect(() => setIsVisible(chat.visible), [ chat.visible ]);

    return (
        <div ref={ elementRef } className={ `bubble-container ${ isVisible ? 'visible' : 'invisible' }` } onClick={ event => onChatClicked(chat) }>
            { (chat.styleId === 0) &&
                <div className="user-container-bg" style={ { backgroundColor: chat.color } } /> }
            <div className={ `chat-bubble bubble-${ chat.styleId } type-${ chat.type }` } style={ { maxWidth: getBubbleWidth } }>
                <div className="user-container">
                    { chat.imageUrl && (chat.imageUrl.length > 0) &&
                        <div className="user-image" style={ { backgroundImage: `url(${ chat.imageUrl })` } } /> }
                </div>
                <div className="chat-content">
                    <span className="username mr-1" dangerouslySetInnerHTML={ { __html: `${ chat.username }: ` } } />
                    <span className="message" dangerouslySetInnerHTML={ { __html: `${ chat.formattedText }` } } />
                </div>
                <div className="pointer" />
            </div>
        </div>
    );
}
