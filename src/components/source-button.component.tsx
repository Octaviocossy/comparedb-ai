import React from 'react';
import { Github } from 'lucide-react';

import { Button } from './ui/button';

export function SourceButtonComponent() {
  return (
    <Button className="h-9 cursor-pointer" size="sm" variant="outline" onClick={() => window.open('https://github.com/Octaviocossy/comparedb-ai', '_blank')}>
      <Github />
      <p>Source Code</p>
    </Button>
  );
}
