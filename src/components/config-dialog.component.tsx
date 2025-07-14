'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ConfigDialog({ onConfig, config }: { onConfig: (API_KEY: string, MODEL: string) => void; config: { API_KEY: string | null; MODEL: string | null } }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [openAIKey, setOpenAIKey] = useState<string | null>(config.API_KEY);
  const [model, setModel] = useState<string | null>(config.MODEL || 'gpt-4o');

  const handleSave = () => {
    if (!openAIKey || !model) {
      toast.error('Please fill in all fields');

      return;
    }

    onConfig(openAIKey, model);

    toast.success('Configuration saved');

    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-9 h-9 p-0 cursor-pointer" size="icon" variant="outline">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription>Configure the API key and model for the OpenAI API.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="openai-key">OpenAI Key</Label>
          <Input id="openai-key" type="password" value={openAIKey ?? ''} onChange={(e) => setOpenAIKey(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="model">Model</Label>
          <Select value={model ?? ''} onValueChange={(value) => setModel(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="w-1/2 cursor-pointer" type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button className="w-1/2 cursor-pointer" disabled={!openAIKey || !model} type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
