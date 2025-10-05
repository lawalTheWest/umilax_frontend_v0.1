import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';

/**
 * SplashScreen
 * Displays the UMILAX splash screen, provides a manual login button,
 * and provides a manual login button only.
 */
export default function SplashScreen() {
	const router = useRouter();

			// For web, use src prop; for native, use require
			const logoSource = Platform.OS === 'web'
				? undefined
				: require('../assets/images/logo.png');

			// Swipe gesture handler
			const handleSwipeLeft = () => router.push('/auth');
			const touchX = React.useRef(null);

			return (
				<View style={styles.container}>
					<View
						style={styles.card}
						onTouchStart={e => (touchX.current = e.nativeEvent.pageX)}
						onTouchEnd={e => {
							if (touchX.current !== null) {
								if (touchX.current - e.nativeEvent.pageX > 50) handleSwipeLeft();
								touchX.current = null;
							}
						}}
					>
						<View style={styles.logoContainer}>
							{Platform.OS === 'web' ? (
								<Image
									src={'/assets/images/logo.png'}
									style={{ width: 96, height: 96, borderRadius: 48 }}
									alt="UMILAX Logo"
								/>
							) : (
								<Image
									source={logoSource}
									style={styles.logoImage}
									resizeMode="contain"
								/>
							)}
						</View>
						<Text style={styles.title}>UMILAX Salon Management</Text>
						<Text style={styles.subtitle}>Welcome to your modern salon experience!</Text>
						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={styles.navButton}
								onPress={handleSwipeLeft}
								activeOpacity={0.85}
							>
								<Text style={styles.navButtonText}>Next</Text>
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
			logoContainer: {
				marginBottom: 24,
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'transparent',
			},
					logoImage: {
						width: 96,
						height: 96,
						borderRadius: 48,
					},
		title: {
			fontSize: 30,
			fontWeight: 'bold',
			color: '#4f46e5',
			marginBottom: 10,
			textAlign: 'center',
			letterSpacing: 0.5,
		},
		subtitle: {
			fontSize: 18,
			color: '#64748b',
			marginBottom: 32,
			textAlign: 'center',
			letterSpacing: 0.2,
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
