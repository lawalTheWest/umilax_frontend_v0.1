import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';

export default function AuthScreen() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleLogin = () => {
		if (username === 'ceo') {
			router.replace('/dashboard?role=CEO');
		} else if (username === 'secretary') {
			router.replace('/dashboard?role=Secretary');
		} else {
			router.replace('/dashboard?role=Employee');
		}
	};

	// Swipe gesture handler
	const handleSwipeRight = () => router.push('/');
	const touchX = React.useRef<number | null>(null);

	return (
		<View style={styles.container}>
			<View
				style={styles.card}
				onTouchStart={e => (touchX.current = e.nativeEvent.pageX)}
				onTouchEnd={e => {
					if (touchX.current !== null) {
						if (e.nativeEvent.pageX - touchX.current > 50) handleSwipeRight();
						touchX.current = null;
					}
				}}
			>
				<Text style={styles.title}>Login to UMILAX</Text>
				<TextInput
					style={styles.input}
					placeholder="Username"
					value={username}
					onChangeText={setUsername}
					autoCapitalize="none"
					placeholderTextColor="#a1a1aa"
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					secureTextEntry
					value={password}
					onChangeText={setPassword}
					placeholderTextColor="#a1a1aa"
				/>
				<TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
					<Text style={styles.loginButtonText}>Login</Text>
				</TouchableOpacity>
				<View style={styles.buttonRow}>
					<TouchableOpacity
						style={styles.navButton}
						onPress={handleSwipeRight}
						activeOpacity={0.85}
					>
						<Text style={styles.navButtonText}>Previous</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 24,
	},
	navButton: {
		backgroundColor: '#e5e7eb',
		paddingVertical: 10,
		paddingHorizontal: 24,
		borderRadius: 16,
		marginHorizontal: 8,
	},
	navButtonText: {
		color: '#4f46e5',
		fontWeight: 'bold',
		fontSize: 16,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		paddingHorizontal: 24,
	},
			card: {
				width: '100%',
				maxWidth: 350,
				backgroundColor: '#fff',
				borderRadius: 32,
				paddingVertical: 40,
				paddingHorizontal: 24,
				alignItems: 'center',
				marginBottom: 24,
				boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
			},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#4f46e5',
		marginBottom: 24,
		textAlign: 'center',
		letterSpacing: 0.5,
	},
	input: {
		width: 260,
		backgroundColor: '#f3f4f6',
		borderRadius: 18,
		paddingVertical: 12,
		paddingHorizontal: 18,
		fontSize: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		color: '#222',
	},
			loginButton: {
				backgroundColor: '#4f46e5',
				paddingVertical: 14,
				paddingHorizontal: 48,
				borderRadius: 24,
				alignItems: 'center',
				marginTop: 18,
				boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
			},
	loginButtonText: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
});
