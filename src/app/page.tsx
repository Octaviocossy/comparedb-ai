'use client';

import { AlertCircle, Copy, Download, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/hooks';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ConfigDialog = dynamic(() => import('@/components/config-dialog.component').then((mod) => mod.ConfigDialog), {
  ssr: false,
});

export default function Home() {
  const [schema, setSchema] = useState<{ schema_source: string; schema_target: string }>({
    schema_source: '',
    schema_target: '',
  });

  const [config, setConfig] = useState<{ API_KEY: string | null; MODEL: string | null }>({
    API_KEY: null,
    MODEL: null,
  });

  const [diff, setDiff] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState({
    compare: false,
    copy: false,
    copySource: false,
    copyTarget: false,
    clearSource: false,
    clearTarget: false,
  });

  const handleCompare = async () => {
    setIsLoading((prev) => ({ ...prev, compare: true }));

    setDiff(null);

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: JSON.stringify({
          schema_source: schema.schema_source,
          schema_target: schema.schema_target,
          openai_key: config.API_KEY,
          model: config.MODEL,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compare the scripts');
      }

      const data: { changes: string[]; sql_script: string } = await response.json();

      setDiff(data.sql_script);

      toast.success('Compare completed', {
        description: 'Database scripts have been successfully compared.',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Compare failed', { description: 'Failed to compare the scripts' });
    } finally {
      setIsLoading((prev) => ({ ...prev, compare: false }));
    }
  };

  const handleCopy = async (text: string, type: string) => {
    const loadingKey = type === 'Source' ? 'copySource' : 'copyTarget';

    setIsLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      await navigator.clipboard.writeText(text);
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success('Copied to clipboard', {
        description: `${type} script copied successfully`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Copy failed', {
        description: 'Failed to copy script to clipboard',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleClear = async (type: 'source' | 'target') => {
    const loadingKey = type === 'source' ? 'clearSource' : 'clearTarget';

    setIsLoading((prev) => ({ ...prev, [loadingKey]: true }));

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (type === 'source') {
        setSchema({ ...schema, schema_source: '' });
      } else {
        setSchema({ ...schema, schema_target: '' });
      }

      toast.success('Script cleared', {
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} script has been cleared`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Clear failed', {
        description: 'Failed to clear the script',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [loadingKey]: false }));
      setDiff(null);
    }
  };

  const handleCopyDiff = async () => {
    if (!diff) {
      toast.error('No diff found', {
        description: 'Please compare the scripts first',
      });

      return;
    }

    setIsLoading((prev) => ({ ...prev, export: true }));

    try {
      await navigator.clipboard.writeText(diff);

      toast.success('Diff copied to clipboard', {
        description: 'Diff report has been copied to clipboard',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Copy failed', {
        description: 'Failed to copy the diff report',
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, export: false }));
    }
  };

  useEffect(() => {
    if (schema.schema_source === '' || schema.schema_target === '') {
      setDiff(null);
    }
  }, [schema.schema_source, schema.schema_target, diff]);

  const handleConfig = (API_KEY: string, MODEL: string) => setConfig({ API_KEY, MODEL });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Database Schema Comparison</h1>
              <p className="text-gray-600 dark:text-gray-400">Compare reference (truth) and target (outdated) database schemas</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <ConfigDialog config={config} onConfig={handleConfig} />
            </div>
          </div>
        </div>

        {config.API_KEY === null && config.MODEL === null && (
          <Alert variant="warning">
            <AlertCircle />
            <AlertTitle>API Key Configuration needed</AlertTitle>
            <AlertDescription>Please enter an OpenAI API Key, your information will not be stored.</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-6">
          {/* Reference Script */}
          <Card className="h-[600px] flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Source</CardTitle>
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" variant="secondary">
                    Reference
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={isLoading.copySource}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(schema.schema_source, 'Source')}
                  >
                    {isLoading.copySource ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button className="hover:bg-gray-100 dark:hover:bg-gray-700" disabled={isLoading.clearSource} size="sm" variant="ghost" onClick={() => handleClear('source')}>
                    {isLoading.clearSource ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 rounded-lg px-4 py-0">
              <Textarea
                className="resize-none border-0 font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 h-[505px] p-4 rounded-lg border-none bg-gray-100 dark:bg-gray-700"
                placeholder="Paste your source database script here..."
                value={schema.schema_source}
                onChange={(e) => setSchema({ ...schema, schema_source: e.target.value })}
              />
            </CardContent>
          </Card>

          {/* Target Script */}
          <Card className="h-[600px] flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Target</CardTitle>
                  <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200" variant="secondary">
                    Outdated
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={isLoading.copyTarget}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(schema.schema_target, 'Target')}
                  >
                    {isLoading.copyTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button className="hover:bg-gray-100 dark:hover:bg-gray-700" disabled={isLoading.clearTarget} size="sm" variant="ghost" onClick={() => handleClear('target')}>
                    {isLoading.clearTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 rounded-lg px-4 py-0">
              <Textarea
                className="resize-none border-0 font-mono text-sm leading-relaxed text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 p-4 rounded-lg border-none bg-gray-100 dark:bg-gray-700 h-[505px]"
                placeholder="Paste your target database script here..."
                value={schema.schema_target}
                onChange={(e) => setSchema({ ...schema, schema_target: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            className="py-6 w-[15rem] bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white cursor-pointer"
            disabled={!schema.schema_source || !schema.schema_target || isLoading.compare}
            onClick={handleCompare}
          >
            {isLoading.compare ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              'Compare'
            )}
          </Button>

          {diff && (
            <Button
              className="py-6 w-[15rem] bg-transparent border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              disabled={isLoading.copy || !diff}
              variant="outline"
              onClick={handleCopyDiff}
            >
              {isLoading.copy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Copy Diff
                </>
              )}
            </Button>
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Source: {schema.schema_source.split('\n').length} lines</span>
              <span>Target: {schema.schema_target.split('\n').length} lines</span>
            </div>
            <div className="flex items-center gap-2">
              {Object.values(isLoading).some(Boolean) ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400">Processing...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full" />
                  <span>Ready for comparison</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
