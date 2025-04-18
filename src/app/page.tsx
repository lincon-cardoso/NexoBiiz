import { Cabecalho } from '@/components/cabecalho/Cabecalho';
import { Rodape } from '@/components/rodape/Rodape';
import Home from '@/app/home/page';

export default function HomePageComponent() {
  return (
    <div >
      <Cabecalho />
      <Home />
      <Rodape />
    </div>
  );
}