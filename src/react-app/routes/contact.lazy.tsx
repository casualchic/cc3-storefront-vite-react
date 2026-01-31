// src/react-app/routes/contact.lazy.tsx

import { createLazyFileRoute } from '@tanstack/react-router';
import { ContactPage } from '../pages/ContactPage';

export const Route = createLazyFileRoute('/contact')({
	component: ContactPageComponent,
});

function ContactPageComponent() {
	return <ContactPage />;
}
