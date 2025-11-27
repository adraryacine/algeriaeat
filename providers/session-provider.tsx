import { supabase } from '@/lib/supabase';
import type { AdminProfile, ClientProfile, LivreurProfile, RestaurantProfile, UserRole } from '@/types/user';
import type { Session, User } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserProfile = ClientProfile | RestaurantProfile | LivreurProfile | AdminProfile;

type SessionContextValue = {
  user: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    meta?: { name?: string; phone?: string; role?: UserRole }
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  switchRole: (role: UserRole) => void; // For demo purposes
  loginAsRole: (role: UserRole) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        // Map database profile to typed profile based on role
        const baseProfile = {
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone,
          avatar: data.avatar_url,
          role: data.role || 'client',
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        switch (data.role) {
          case 'restaurant':
            setUser({
              ...baseProfile,
              role: 'restaurant',
              restaurant_id: data.restaurant_id || '',
              restaurant_name: data.restaurant_name || '',
              restaurant_logo: data.restaurant_logo,
              restaurant_cover: data.restaurant_cover,
              description: data.description,
              cuisine_types: data.cuisine_types || [],
              address: data.address || '',
              wilaya: data.wilaya || '',
              commune: data.commune || '',
              coordinates: data.coordinates,
              opening_hours: data.opening_hours || {},
              is_verified: data.is_verified || false,
              hygiene_rating: data.hygiene_rating,
              average_rating: data.average_rating || 0,
              total_reviews: data.total_reviews || 0,
              delivery_zones: data.delivery_zones || [],
              minimum_order: data.minimum_order || 0,
              delivery_fee: data.delivery_fee || 150,
              estimated_delivery_time: data.estimated_delivery_time || '30-45 min',
              is_open: data.is_open ?? true,
              is_accepting_orders: data.is_accepting_orders ?? true,
              commission_rate: data.commission_rate || 15,
              bank_details: data.bank_details,
            } as RestaurantProfile);
            break;

          case 'livreur':
            setUser({
              ...baseProfile,
              role: 'livreur',
              vehicle_type: data.vehicle_type || 'moto',
              vehicle_plate: data.vehicle_plate,
              license_number: data.license_number,
              is_available: data.is_available ?? false,
              is_verified: data.is_verified || false,
              current_location: data.current_location,
              active_delivery_id: data.active_delivery_id,
              total_deliveries: data.total_deliveries || 0,
              average_rating: data.average_rating || 0,
              total_earnings: data.total_earnings || 0,
              wilaya: data.wilaya || '',
              zones: data.zones || [],
              bank_details: data.bank_details,
            } as LivreurProfile);
            break;

          case 'admin':
            setUser({
              ...baseProfile,
              role: 'admin',
              permissions: data.permissions || ['view_analytics'],
              department: data.department,
            } as AdminProfile);
            break;

          default:
            setUser({
              ...baseProfile,
              role: 'client',
              addresses: data.addresses || [],
              favorite_restaurants: data.favorite_restaurants || [],
              loyalty_points: data.loyalty_points || 0,
              vip_level: data.vip_level || 'bronze',
              dietary_preferences: data.dietary_preferences || {
                is_vegetarian: false,
                is_vegan: false,
                is_gluten_free: false,
                allergies: [],
                spice_level: 3,
                calorie_conscious: false,
              },
              birthday: data.birthday,
              referral_code: data.referral_code || generateReferralCode(),
              referred_by: data.referred_by,
            } as ClientProfile);
        }
      } else {
        // Create profile from auth metadata if it doesn't exist
        const authUser = (await supabase.auth.getUser()).data.user;
        if (authUser) {
          const defaultProfile: ClientProfile = {
            id: authUser.id,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
            email: authUser.email || '',
            phone: authUser.user_metadata?.phone,
            avatar: authUser.user_metadata?.avatar_url,
            role: authUser.user_metadata?.role || 'client',
            addresses: [],
            favorite_restaurants: [],
            loyalty_points: 0,
            vip_level: 'bronze',
            dietary_preferences: {
              is_vegetarian: false,
              is_vegan: false,
              is_gluten_free: false,
              allergies: [],
              spice_level: 3,
              calorie_conscious: false,
            },
            referral_code: generateReferralCode(),
          };
          setUser(defaultProfile);
        }
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    meta?: { name?: string; phone?: string; role?: UserRole }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { ...meta, role: meta?.role || 'client' },
      },
    });

    if (!error && data.user) {
      // Create profile record with role
      const profileData: Record<string, unknown> = {
        id: data.user.id,
        email,
        name: meta?.name || email.split('@')[0],
        phone: meta?.phone,
        role: meta?.role || 'client',
        updated_at: new Date().toISOString(),
      };

      // Add role-specific default data
      if (meta?.role === 'client' || !meta?.role) {
        profileData.loyalty_points = 100; // Welcome bonus
        profileData.vip_level = 'bronze';
        profileData.referral_code = generateReferralCode();
      }

      await supabase.from('profiles').upsert(profileData);
    }

    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabaseUser) return { error: new Error('Not authenticated') };

    const { error } = await supabase.from('profiles').upsert({
      id: supabaseUser.id,
      ...updates,
      updated_at: new Date().toISOString(),
    });

    if (!error && user) {
      setUser({ ...user, ...updates } as UserProfile);
    }

    return { error: error ? new Error(error.message) : null };
  };

  // For demo / role switching
  const switchRole = (role: UserRole) => {
    const profile = buildProfileForRole(role, user);
    setUser(profile);
  };

  const loginAsRole = (role: UserRole) => {
    const profile = buildProfileForRole(role, null);
    setUser(profile);
    setSession(null);
    setSupabaseUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      supabaseUser,
      session,
      isAuthenticated: !!user,
      isLoading,
      role: user?.role ?? null,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      updateProfile,
      switchRole,
      loginAsRole,
    }),
    [user, supabaseUser, session, isLoading]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}

// Helper function to generate referral codes
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'AE-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function buildProfileForRole(role: UserRole, existing: UserProfile | null): UserProfile {
  const base = {
    id: existing?.id ?? `demo-${role}-${Math.random().toString(36).slice(2, 8)}`,
    name: existing?.name ?? `Utilisateur ${role}`,
    email: existing?.email ?? `demo+${role}@algeriaeat.com`,
    phone: existing?.phone ?? '+213 555 000 000',
    avatar:
      existing?.avatar ??
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  };

  switch (role) {
    case 'restaurant':
      return {
        ...base,
        role: 'restaurant',
        restaurant_id: (existing as RestaurantProfile)?.restaurant_id ?? 'demo-restaurant-1',
        restaurant_name: (existing as RestaurantProfile)?.restaurant_name ?? 'Restaurant Demo',
        restaurant_logo: (existing as RestaurantProfile)?.restaurant_logo,
        restaurant_cover: (existing as RestaurantProfile)?.restaurant_cover,
        description:
          (existing as RestaurantProfile)?.description ?? 'Espace partenaire AlgeriaEat.',
        cuisine_types: (existing as RestaurantProfile)?.cuisine_types ?? ['Algérien', 'Traditionnel'],
        address: (existing as RestaurantProfile)?.address ?? '123 Rue Didouche Mourad, Alger',
        wilaya: (existing as RestaurantProfile)?.wilaya ?? '16',
        commune: (existing as RestaurantProfile)?.commune ?? 'Alger Centre',
        coordinates: (existing as RestaurantProfile)?.coordinates,
        opening_hours: (existing as RestaurantProfile)?.opening_hours ?? {},
        is_verified: (existing as RestaurantProfile)?.is_verified ?? true,
        hygiene_rating: (existing as RestaurantProfile)?.hygiene_rating ?? 4.5,
        average_rating: (existing as RestaurantProfile)?.average_rating ?? 4.6,
        total_reviews: (existing as RestaurantProfile)?.total_reviews ?? 120,
        delivery_zones: (existing as RestaurantProfile)?.delivery_zones ?? ['16'],
        minimum_order: (existing as RestaurantProfile)?.minimum_order ?? 500,
        delivery_fee: (existing as RestaurantProfile)?.delivery_fee ?? 150,
        estimated_delivery_time:
          (existing as RestaurantProfile)?.estimated_delivery_time ?? '30-45 min',
        is_open: (existing as RestaurantProfile)?.is_open ?? true,
        is_accepting_orders: (existing as RestaurantProfile)?.is_accepting_orders ?? true,
        commission_rate: (existing as RestaurantProfile)?.commission_rate ?? 15,
        bank_details: (existing as RestaurantProfile)?.bank_details,
      } as RestaurantProfile;

    case 'livreur':
      return {
        ...base,
        role: 'livreur',
        vehicle_type: (existing as LivreurProfile)?.vehicle_type ?? 'moto',
        vehicle_plate: (existing as LivreurProfile)?.vehicle_plate ?? '123-ABC-16',
        license_number: (existing as LivreurProfile)?.license_number ?? 'DRV-ALG-12345',
        is_available: (existing as LivreurProfile)?.is_available ?? true,
        is_verified: (existing as LivreurProfile)?.is_verified ?? true,
        current_location: (existing as LivreurProfile)?.current_location,
        active_delivery_id: (existing as LivreurProfile)?.active_delivery_id,
        total_deliveries: (existing as LivreurProfile)?.total_deliveries ?? 250,
        average_rating: (existing as LivreurProfile)?.average_rating ?? 4.9,
        total_earnings: (existing as LivreurProfile)?.total_earnings ?? 125000,
        wilaya: (existing as LivreurProfile)?.wilaya ?? '16',
        zones: (existing as LivreurProfile)?.zones ?? ['Alger Centre', 'El Biar'],
        bank_details: (existing as LivreurProfile)?.bank_details,
      } as LivreurProfile;

    case 'admin':
      return {
        ...base,
        role: 'admin',
        permissions: (existing as AdminProfile)?.permissions ?? ['manage_users', 'super_admin'],
        department: (existing as AdminProfile)?.department ?? 'Operations',
      } as AdminProfile;

    default:
      return {
        ...base,
        role: 'client',
        addresses: (existing as ClientProfile)?.addresses ?? [],
        favorite_restaurants: (existing as ClientProfile)?.favorite_restaurants ?? [],
        loyalty_points: (existing as ClientProfile)?.loyalty_points ?? 500,
        vip_level: (existing as ClientProfile)?.vip_level ?? 'silver',
        dietary_preferences:
          (existing as ClientProfile)?.dietary_preferences ?? {
            is_vegetarian: false,
            is_vegan: false,
            is_gluten_free: false,
            allergies: [],
            spice_level: 3,
            calorie_conscious: false,
          },
        birthday: (existing as ClientProfile)?.birthday,
        referral_code: (existing as ClientProfile)?.referral_code ?? generateReferralCode(),
        referred_by: (existing as ClientProfile)?.referred_by,
      } as ClientProfile;
  }
}
