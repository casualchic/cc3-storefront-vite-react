import { lazy } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '../pages/ContactPage';

const ContactPageComponent = () => <ContactPage />;

export const Route = createFileRoute('/contact')({
  component: lazy(() => Promise.resolve({ default: ContactPageComponent })),
});
