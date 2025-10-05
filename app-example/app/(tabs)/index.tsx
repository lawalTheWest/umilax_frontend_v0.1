import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#1a2238' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.umilaxLogo}
        />
      }>
      <ThemedView style={[styles.titleContainer, { backgroundColor: '#1a2238', borderRadius: 12, paddingBottom: 24 }]}> 
        <ThemedText type="title" style={{ color: '#fff' }}>Welcome to UMILAX</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={[styles.stepContainer, { backgroundColor: '#8d5524', borderRadius: 12, padding: 12 }]}> 
        <ThemedText type="subtitle" style={{ color: '#fff' }}>Your Salon Management Dashboard</ThemedText>
        <ThemedText style={{ color: '#fff' }}>
          Edit <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
  <ThemedView style={[styles.stepContainer, { backgroundColor: '#fff', borderRadius: 12, padding: 12 }]}> 
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  umilaxLogo: {
    height: 120,
    width: 120,
    marginBottom: 20,
    alignSelf: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 24,
    borderRadius: 12,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
});
