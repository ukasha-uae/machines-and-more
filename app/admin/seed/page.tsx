'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react';
import { seedProducts } from '@/lib/firebase/seed';
import { addDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';

export default function SeedPage() {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setResult(null);
    
    try {
      const productsCollection = collection(db, 'products');
      let count = 0;

      for (const product of seedProducts) {
        await addDoc(productsCollection, product);
        count++;
      }

      setResult({
        success: true,
        message: `Successfully seeded ${count} products to the database!`
      });
    } catch (error: any) {
      console.error('Seeding error:', error);
      setResult({
        success: false,
        message: `Error seeding database: ${error.message || 'Unknown error'}`
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to delete ALL products? This cannot be undone!')) {
      return;
    }

    setClearing(true);
    setResult(null);

    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      
      let count = 0;
      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
        count++;
      }

      setResult({
        success: true,
        message: `Successfully deleted ${count} products from the database.`
      });
    } catch (error: any) {
      console.error('Clearing error:', error);
      setResult({
        success: false,
        message: `Error clearing database: ${error.message || 'Unknown error'}`
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Database Management</h1>
          <p className="text-gray-600">Seed or clear your product database</p>
        </div>

        {/* Firebase Status Check */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Database className="h-5 w-5" />
              Firebase Configuration Status
            </CardTitle>
            <CardDescription className="text-blue-700">
              Make sure you've configured your Firebase credentials in .env.local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 text-sm space-y-2">
              <p className="font-semibold">Required environment variables:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
              </ul>
              <p className="mt-3 text-gray-600">
                Copy .env.example to .env.local and fill in your Firebase project credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {/* Seed Database Card */}
          <Card>
            <CardHeader>
              <CardTitle>Seed Database</CardTitle>
              <CardDescription>
                Add sample products to your database for testing. Includes excavators, tractors, trucks, and generators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="font-semibold text-yellow-900 mb-1">Note:</p>
                <p className="text-yellow-800">
                  This will add {seedProducts.length} sample products. You can run this multiple times, 
                  but it will create duplicates. Use "Clear Database" first if needed.
                </p>
              </div>
              
              <Button 
                onClick={handleSeed}
                disabled={seeding || clearing}
                size="lg"
                className="w-full bg-amazon-orange hover:bg-amazon-hover"
              >
                {seeding ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Seed Database with Sample Products
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Clear Database Card */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900">Clear Database</CardTitle>
              <CardDescription>
                Delete all products from the database. This action cannot be undone!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleClear}
                disabled={seeding || clearing}
                size="lg"
                variant="destructive"
                className="w-full"
              >
                {clearing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Clearing Database...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-5 w-5" />
                    Clear All Products
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result Message */}
        {result && (
          <Card className={`mt-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-semibold ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? 'Success!' : 'Error'}
                  </p>
                  <p className={result.success ? 'text-green-800' : 'text-red-800'}>
                    {result.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" asChild>
            <a href="/admin">← Back to Admin Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
