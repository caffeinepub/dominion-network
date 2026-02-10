import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import { useGetChatRoomMessages, useSendChatMessage } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

interface ChatRoomComponentProps {
  roomId: bigint;
  onClose: () => void;
}

export function ChatRoomComponent({ roomId, onClose }: ChatRoomComponentProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useGetChatRoomMessages(roomId);
  const sendMessage = useSendChatMessage();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;

    try {
      let fileBlob: ExternalBlob | null = null;
      let messageType: any = 'text';

      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        fileBlob = ExternalBlob.fromBytes(uint8Array);

        if (selectedFile.type.startsWith('image/')) messageType = 'image';
        else if (selectedFile.type.startsWith('video/')) messageType = 'video';
        else if (selectedFile.type.startsWith('audio/')) messageType = 'audio';
        else messageType = 'file';
      }

      await sendMessage.mutateAsync({
        roomId,
        content: message || selectedFile?.name || '',
        messageType,
        fileBlob
      });

      setMessage('');
      setSelectedFile(null);
      refetch();
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Chat Room</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div key={msg.id.toString()} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {msg.sender.toString().slice(0, 10)}...
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {msg.messageType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(Number(msg.timestamp) / 1000000).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm break-words">{msg.content}</p>
                      {msg.fileBlob && (
                        <div className="mt-2 p-2 bg-background rounded border">
                          {msg.messageType === 'image' && (
                            <img 
                              src={msg.fileBlob.getDirectURL()} 
                              alt="Shared" 
                              className="max-w-full h-auto rounded"
                            />
                          )}
                          {msg.messageType === 'video' && (
                            <video 
                              src={msg.fileBlob.getDirectURL()} 
                              controls 
                              className="max-w-full h-auto rounded"
                            />
                          )}
                          {msg.messageType === 'file' && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">File attachment</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <FileText className="h-4 w-4" />
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelectedFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button onClick={handleSend} disabled={sendMessage.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
