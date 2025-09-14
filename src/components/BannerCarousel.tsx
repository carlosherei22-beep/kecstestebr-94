import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabasePublic as supabase } from '@/integrations/supabase/publicClient';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  category_id?: string;
  is_active: boolean;
  order_position: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async (banner: Banner) => {
    if (banner.category_id) {
      // Buscar o slug da categoria
      try {
        const { data: category, error } = await supabase
          .from('categories')
          .select('slug')
          .eq('id', banner.category_id)
          .single();

        if (error) throw error;
        
        if (category) {
          navigate(`/produtos?categoria=${category.slug}`);
          return;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    }
    
    if (banner.link_url) {
      window.open(banner.link_url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="w-full h-80 md:h-96 bg-gradient-subtle animate-pulse rounded-lg mb-8" />
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-80 md:h-96 bg-gradient-primary rounded-lg mb-8 flex items-center justify-center">
        <div className="text-center text-primary-foreground">
          <h3 className="text-2xl font-bold mb-2">KECINFORSTORE</h3>
          <p className="text-lg">Os melhores produtos em tecnologia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div 
                className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden bg-muted cursor-pointer"
                onClick={() => handleBannerClick(banner)}
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 image-rendering-auto"
                  style={{ 
                    filter: 'contrast(1.1) saturate(1.1) brightness(1.05)',
                  }}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{banner.title}</h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;