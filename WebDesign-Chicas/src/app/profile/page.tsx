import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
          <p className="text-gray-600">Gerencie seus eventos e pedidos</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Meus eventos</CardTitle>
              <CardDescription>
                Visualize e gerencie seus eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Funcionalidade em desenvolvimento</p>
                <Button disabled>Em breve</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criar evento</CardTitle>
              <CardDescription>
                Crie um novo evento personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Funcionalidade em desenvolvimento</p>
                <Button disabled>Em breve</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



