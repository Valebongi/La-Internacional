import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { isAdmin } from '@/lib/permissions';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import InboxPage from '@/pages/InboxPage';
import ConversationPage from '@/pages/ConversationPage';
import ClientsPage from '@/pages/ClientsPage';
import ClientNewPage from '@/pages/ClientNewPage';
import ClientImportPage from '@/pages/ClientImportPage';
import ClientDetailPage from '@/pages/ClientDetailPage';
import BroadcastsPage from '@/pages/BroadcastsPage';
import BroadcastNewPage from '@/pages/BroadcastNewPage';
import TemplatesPage from '@/pages/TemplatesPage';
import TemplateNewPage from '@/pages/TemplateNewPage';
import TemplateDetailPage from '@/pages/TemplateDetailPage';
import PostsalePage from '@/pages/PostsalePage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';

function ProtectedRoutes() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect to="/login" />;
  const admin = isAdmin(user);
  return (
    <AppShell>
      <Switch>
        <Route exact path="/inbox" component={InboxPage} />
        <Route exact path="/conversations/:id" component={ConversationPage} />
        <Route exact path="/clients" component={ClientsPage} />
        <Route exact path="/clients/new" component={ClientNewPage} />
        <Route exact path="/clients/import" component={ClientImportPage} />
        <Route exact path="/clients/:id" component={ClientDetailPage} />
        <Route exact path="/broadcasts" component={BroadcastsPage} />
        <Route exact path="/broadcasts/new" component={BroadcastNewPage} />
        <Route exact path="/templates" component={TemplatesPage} />
        <Route exact path="/templates/new" component={TemplateNewPage} />
        <Route exact path="/templates/:id" component={TemplateDetailPage} />
        <Route exact path="/postsale" component={PostsalePage} />
        <Route exact path="/analytics">
          {admin ? <AnalyticsPage /> : <Redirect to="/inbox" />}
        </Route>
        <Route exact path="/settings">
          {admin ? <SettingsPage /> : <Redirect to="/inbox" />}
        </Route>
        <Redirect exact from="/" to="/inbox" />
        <Redirect to="/inbox" />
      </Switch>
    </AppShell>
  );
}

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Switch>
              <Route exact path="/login" component={LoginPage} />
              <Route component={ProtectedRoutes} />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
}
