import React from "react";
import ReactDOM from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import { Provider } from "./components/ui/provider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 5,
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider>
				<App />
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>,
);
