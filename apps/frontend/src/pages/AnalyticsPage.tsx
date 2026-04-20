import { IonIcon } from '@ionic/react';
import {
  peopleOutline,
  chatbubblesOutline,
  trendingUpOutline,
  cashOutline,
  megaphoneOutline,
  timeOutline,
} from 'ionicons/icons';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { mockFunnel, mockTrend } from '@/lib/mock-data';

const advisorsData = [
  { advisor: 'Sofía', conv: 84, compras: 28 },
  { advisor: 'Carla', conv: 76, compras: 24 },
  { advisor: 'Julia', conv: 68, compras: 22 },
  { advisor: 'Lu',    conv: 92, compras: 34 },
  { advisor: 'Mica',  conv: 58, compras: 16 },
];

const channelPie = [
  { name: 'WA #1', value: 240, fill: '#7C3AED' },
  { name: 'WA #2', value: 198, fill: '#8B5CF6' },
  { name: 'WA #3', value: 172, fill: '#2563EB' },
  { name: 'WA #4', value: 148, fill: '#0EA5E9' },
  { name: 'WA #5', value: 124, fill: '#38BDF8' },
  { name: 'Instagram', value: 92, fill: '#EC4899' },
];

export default function AnalyticsPage() {
  return (
    <div className="lid-page lid-fade-up">
      <div className="lid-page-header">
        <div>
          <h1 className="lid-page-title">Analítica</h1>
          <p className="lid-page-subtitle">Embudo, conversión, performance por asesora y costo por estado</p>
        </div>
        <div className="lid-tabs">
          <button className="lid-tab">Hoy</button>
          <button className="lid-tab">7 días</button>
          <button className="lid-tab active">30 días</button>
          <button className="lid-tab">Trimestre</button>
        </div>
      </div>

      <div className="lid-grid lid-grid-4" style={{ marginBottom: 24 }}>
        <Stat label="Contactos totales" value="840" tone="violet" icon={peopleOutline} trend="+12.4%" up />
        <Stat label="Conversaciones abiertas" value="312" tone="blue" icon={chatbubblesOutline} trend="+3.1%" up />
        <Stat label="Tasa de compra" value="25.2%" tone="sky" icon={trendingUpOutline} trend="+1.8 pp" up />
        <Stat label="Costo por compra" value="$1.84k" tone="pink" icon={cashOutline} trend="-4.2%" up />
      </div>

      <div className="lid-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: 24 }}>
        <div className="lid-card" style={{ padding: 20 }}>
          <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 className="lid-h2">Embudo de conversión</h3>
              <p className="lid-muted" style={{ fontSize: 12, margin: 0 }}>Cantidad de clientes en cada estado (últimos 30 días)</p>
            </div>
            <span className="lid-badge lid-badge-violet lid-badge-dot">6 estados</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={mockFunnel} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--lid-gray-100)" horizontal={false} />
              <XAxis type="number" stroke="var(--lid-gray-400)" fontSize={12} />
              <YAxis type="category" dataKey="stage" stroke="var(--lid-gray-700)" fontSize={12} width={130} />
              <Tooltip
                cursor={{ fill: 'var(--lid-violet-50)' }}
                contentStyle={{ borderRadius: 12, border: '1px solid var(--lid-gray-200)', fontSize: 12, boxShadow: 'var(--lid-shadow-md)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {mockFunnel.map((entry) => <Cell key={entry.stage} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lid-card" style={{ padding: 20 }}>
          <h3 className="lid-h2" style={{ marginBottom: 6 }}>Canal de origen</h3>
          <p className="lid-muted" style={{ fontSize: 12, margin: '0 0 10px' }}>De dónde entran los contactos</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={channelPie} dataKey="value" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2}>
                {channelPie.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--lid-gray-200)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lid-card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h3 className="lid-h2">Tendencia diaria</h3>
            <p className="lid-muted" style={{ fontSize: 12, margin: 0 }}>Recibidos vs. comprados en los últimos 7 días</p>
          </div>
          <div className="lid-row" style={{ gap: 14, fontSize: 12 }}>
            <div className="lid-row" style={{ gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#7C3AED' }} />
              Recibidos
            </div>
            <div className="lid-row" style={{ gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: '#EC4899' }} />
              Comprados
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mockTrend}>
            <defs>
              <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC4899" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--lid-gray-100)" />
            <XAxis dataKey="day" stroke="var(--lid-gray-400)" fontSize={12} />
            <YAxis stroke="var(--lid-gray-400)" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--lid-gray-200)', fontSize: 12, boxShadow: 'var(--lid-shadow-md)' }} />
            <Area type="monotone" dataKey="recibidos" stroke="#7C3AED" strokeWidth={2.5} fill="url(#recGrad)" />
            <Area type="monotone" dataKey="comprados" stroke="#EC4899" strokeWidth={2.5} fill="url(#compGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="lid-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="lid-card" style={{ padding: 20 }}>
          <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 className="lid-h2">Performance por asesora</h3>
              <p className="lid-muted" style={{ fontSize: 12, margin: 0 }}>Conversaciones y compras cerradas este mes</p>
            </div>
            <IonIcon icon={peopleOutline} style={{ fontSize: 20, color: 'var(--lid-violet-600)' }} />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={advisorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--lid-gray-100)" />
              <XAxis dataKey="advisor" stroke="var(--lid-gray-400)" fontSize={12} />
              <YAxis stroke="var(--lid-gray-400)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--lid-gray-200)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="conv" name="Conversaciones" fill="#2563EB" radius={[6, 6, 0, 0]} />
              <Bar dataKey="compras" name="Compras" fill="#EC4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lid-card" style={{ padding: 20 }}>
          <div className="lid-row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h3 className="lid-h2">Resumen operativo</h3>
              <p className="lid-muted" style={{ fontSize: 12, margin: 0 }}>Lo que está pasando ahora mismo</p>
            </div>
            <IonIcon icon={timeOutline} style={{ fontSize: 20, color: 'var(--lid-violet-600)' }} />
          </div>
          <div className="lid-col" style={{ gap: 10 }}>
            <OpRow icon={chatbubblesOutline} label="Conversaciones sin atender > 1h" value="4" tone="pink" />
            <OpRow icon={peopleOutline} label="Clientes sin asignar" value="12" tone="violet" />
            <OpRow icon={megaphoneOutline} label="Difusiones programadas" value="2" tone="sky" />
            <OpRow icon={cashOutline} label="Costo del día" value="$4.8k" tone="blue" />
            <OpRow icon={trendingUpOutline} label="Tasa de respuesta 24h" value="68%" tone="violet" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, tone, trend, up }: { label: string; value: string; icon: string; tone: 'violet' | 'blue' | 'sky' | 'pink'; trend: string; up?: boolean }) {
  return (
    <div className="lid-stat">
      <div className="lid-stat-head">
        <span className="lid-stat-label">{label}</span>
        <div className={`lid-stat-icon ${tone}`}>
          <IonIcon icon={icon} />
        </div>
      </div>
      <div className="lid-stat-value">{value}</div>
      <div className={`lid-stat-trend ${up ? 'up' : 'down'}`}>
        <IonIcon icon={trendingUpOutline} />
        {trend}
      </div>
    </div>
  );
}

function OpRow({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: 'violet' | 'blue' | 'sky' | 'pink' }) {
  return (
    <div className="lid-row" style={{ padding: 12, borderRadius: 10, background: 'var(--lid-gray-50)' }}>
      <div className={`lid-stat-icon ${tone}`} style={{ width: 32, height: 32 }}>
        <IonIcon icon={icon} style={{ fontSize: 16 }} />
      </div>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--lid-gray-700)' }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>{value}</div>
    </div>
  );
}
