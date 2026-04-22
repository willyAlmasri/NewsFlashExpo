import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, type DimensionValue } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Bell, TrendingUp, TrendingDown, Minus, ArrowUpRight, Clock, Bookmark, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Section } from '@/components/layout/Section';
import { ArticleCard } from '@/components/lists/ArticleCard';
import { Skeleton, SkeletonCard, SkeletonMetric } from '@/components/ui/Skeleton';
import { useTheme, spacing, radius, shadows, palette } from '@/theme';
import { typePresets, fontFamily } from '@/theme/typography';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useRefreshControl } from '@/hooks/useRefreshControl';
import { SparkLine } from '@/components/charts/SparkLine';
import { MOCK_ARTICLES, MOCK_STATS, MOCK_ALERTS, MOCK_WATCHLIST } from '@/constants/mockData';
import { getSentimentLabel } from '@/utils/sentiment';
import { formatNumber } from '@/utils/format';
import type { Article } from '@/types/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, TodayStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<TodayStackParamList, 'Today'>;
type RootNav = NativeStackNavigationProp<RootStackParamList>;
type TopicTrend = (typeof MOCK_STATS.trendingTopics)[number]['trend'];

const TOPIC_TREND_META: Record<TopicTrend, { label: string; Icon: typeof TrendingUp }> = {
  up: { label: 'Rising', Icon: TrendingUp },
  down: { label: 'Falling', Icon: TrendingDown },
  stable: { label: 'Stable', Icon: Minus },
};

function buildTopicPrompt(topic: string) {
  return `Give me a concise brief on why "${topic}" is trending today, the main drivers behind it, and what to watch next.`;
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  change, 
  isPositive,
  colors,
}: { 
  label: string; 
  value: string | number; 
  change?: string;
  isPositive?: boolean;
  colors: any;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      {change && (
        <View style={styles.statChangeRow}>
          {isPositive ? (
            <TrendingUp size={12} color={colors.success} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} color={colors.danger} strokeWidth={2.5} />
          )}
          <Text style={[styles.statChange, { color: isPositive ? colors.success : colors.danger }]}>
            {change}
          </Text>
        </View>
      )}
    </View>
  );
}

// Market Index Card
function MarketIndexCard({
  name,
  value,
  change,
  isPositive,
  colors,
}: {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  colors: any;
}) {
  return (
    <View style={[styles.marketCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.marketName, { color: colors.textSecondary }]}>{name}</Text>
      <Text style={[styles.marketValue, { color: colors.text }]}>{value}</Text>
      <View style={[styles.marketChangeRow, { backgroundColor: isPositive ? colors.success + '15' : colors.danger + '15' }]}>
        {isPositive ? (
          <TrendingUp size={10} color={colors.success} strokeWidth={2.5} />
        ) : (
          <TrendingDown size={10} color={colors.danger} strokeWidth={2.5} />
        )}
        <Text style={[styles.marketChange, { color: isPositive ? colors.success : colors.danger }]}>
          {change}
        </Text>
      </View>
    </View>
  );
}

export function TodayScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<Nav>();
  const rootNav = useNavigation<RootNav>();
  const user = useAuthStore((s) => s.user);
  const openChat = useChatStore((s) => s.openChat);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const { refreshing, onRefresh } = useRefreshControl(async () => {
    await new Promise((r) => setTimeout(r, 800));
  });

  const handleArticlePress = useCallback((article: Article) => {
    navigation.navigate('ArticleDetail', { articleId: article.id });
  }, [navigation]);

  const handleArticleLongPress = useCallback((article: Article) => {
    navigation.navigate('ArticleSummary', {
      articleId: article.id,
      deepDiveRoute: 'ArticleDeepDive',
    });
  }, [navigation]);

  const handleTopicPress = useCallback((topic: string) => {
    openChat(buildTopicPrompt(topic));
  }, [openChat]);

  const trendingTopics = React.useMemo(() => {
    const totalMentions = MOCK_STATS.trendingTopics.reduce((sum, topic) => sum + topic.count, 0);
    const maxCount = Math.max(...MOCK_STATS.trendingTopics.map((topic) => topic.count), 1);

    return MOCK_STATS.trendingTopics.map((topic, index) => ({
      ...topic,
      rank: index + 1,
      share: Math.round((topic.count / totalMentions) * 100),
      barWidth: `${Math.max(14, Math.round((topic.count / maxCount) * 100))}%` as DimensionValue,
    }));
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  // Mock market data
  const marketIndices = [
    { name: 'S&P 500', value: '5,234.18', change: '+0.82%', isPositive: true },
    { name: 'NASDAQ', value: '16,428.82', change: '+1.24%', isPositive: true },
    { name: 'DOW', value: '39,512.84', change: '-0.12%', isPositive: false },
  ];

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <View>
            <Skeleton width={200} height={28} />
            <Skeleton width={140} height={14} style={{ marginTop: 8 }} />
          </View>
          <Skeleton width={44} height={44} borderRadius={12} />
        </View>
        <View style={{ marginTop: spacing.xl }}>
          <View style={styles.statsRow}>
            <SkeletonMetric />
            <SkeletonMetric />
            <SkeletonMetric />
          </View>
        </View>
        <View style={{ marginTop: spacing.xl }}>
          <Skeleton width={100} height={18} />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            {greeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </Text>
          <View style={styles.dateRow}>
            <Clock size={12} color={colors.textTertiary} strokeWidth={2} />
            <Text style={[styles.dateText, { color: colors.textTertiary }]}>
              {currentDate}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => rootNav.navigate('Alerts', { screen: 'Alerts' })}
          style={({ pressed }) => [
            styles.notificationBtn,
            { backgroundColor: colors.surface, borderColor: colors.border },
            pressed && styles.pressed,
          ]}
        >
          <Bell size={20} color={colors.text} strokeWidth={1.8} />
          <View style={[styles.notificationDot, { backgroundColor: colors.danger }]} />
        </Pressable>
      </Animated.View>

      {/* Market Overview Banner */}
      <Animated.View entering={FadeInDown.delay(100).springify().damping(18)}>
        <View style={[styles.marketBanner, { backgroundColor: colors.primary }]}>
          <View style={styles.marketBannerContent}>
            <Text style={[styles.marketBannerTitle, { color: palette.white }]}>Market Overview</Text>
            <Text style={[styles.marketBannerSubtitle, { color: palette.white + 'CC' }]}>
              Real-time indices and trends
            </Text>
          </View>
          <View style={styles.marketIndices}>
            {marketIndices.map((index) => (
              <MarketIndexCard key={index.name} {...index} colors={colors} />
            ))}
          </View>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View entering={FadeInDown.delay(200).springify().damping(18)}>
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today&apos;s Pulse</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Articles"
              value={formatNumber(MOCK_STATS.totalArticles)}
              change="+12.5%"
              isPositive={true}
              colors={colors}
            />
            <StatCard
              label="Sentiment"
              value={MOCK_STATS.avgSentiment > 0 ? `+${MOCK_STATS.avgSentiment.toFixed(1)}` : MOCK_STATS.avgSentiment.toFixed(1)}
              change="-3.2%"
              isPositive={false}
              colors={colors}
            />
            <StatCard
              label="Sources"
              value="6"
              colors={colors}
            />
          </View>
        </View>
      </Animated.View>

      {/* Sentiment Distribution */}
      <Animated.View entering={FadeInDown.delay(250).springify().damping(18)}>
        <View style={[styles.sentimentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.sentimentHeader}>
            <Text style={[styles.sentimentTitle, { color: colors.text }]}>Sentiment Distribution</Text>
          </View>
          <View style={styles.sentimentBar}>
            <View style={[styles.sentimentSegment, { flex: MOCK_STATS.sentimentBreakdown.positive, backgroundColor: colors.success, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }]} />
            <View style={[styles.sentimentSegment, { flex: MOCK_STATS.sentimentBreakdown.neutral, backgroundColor: colors.warning }]} />
            <View style={[styles.sentimentSegment, { flex: MOCK_STATS.sentimentBreakdown.negative, backgroundColor: colors.danger, borderTopRightRadius: 4, borderBottomRightRadius: 4 }]} />
          </View>
          <View style={styles.sentimentLabels}>
            <View style={styles.sentimentLabelItem}>
              <View style={[styles.sentimentDot, { backgroundColor: colors.success }]} />
              <Text style={[styles.sentimentLabelText, { color: colors.textSecondary }]}>
                Positive {MOCK_STATS.sentimentBreakdown.positive}%
              </Text>
            </View>
            <View style={styles.sentimentLabelItem}>
              <View style={[styles.sentimentDot, { backgroundColor: colors.warning }]} />
              <Text style={[styles.sentimentLabelText, { color: colors.textSecondary }]}>
                Neutral {MOCK_STATS.sentimentBreakdown.neutral}%
              </Text>
            </View>
            <View style={styles.sentimentLabelItem}>
              <View style={[styles.sentimentDot, { backgroundColor: colors.danger }]} />
              <Text style={[styles.sentimentLabelText, { color: colors.textSecondary }]}>
                Negative {MOCK_STATS.sentimentBreakdown.negative}%
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Trending Topics */}
      <Animated.View entering={FadeInDown.delay(300).springify().damping(18)}>
        <View style={styles.topicsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Topics</Text>
          <View style={styles.topicsList}>
            {trendingTopics.slice(0, 5).map((topic, index) => {
              const trendMeta = TOPIC_TREND_META[topic.trend];
              const trendColor =
                topic.trend === 'up'
                  ? colors.success
                  : topic.trend === 'down'
                    ? colors.danger
                    : colors.textSecondary;

              return (
                <Animated.View key={topic.topic} entering={FadeInDown.delay(350 + index * 50).springify()}>
                  <Pressable
                    onPress={() => handleTopicPress(topic.topic)}
                    style={({ pressed }) => [
                      styles.topicItem,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.topicRank, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.topicRankText, { color: colors.primary }]}>
                        {topic.rank}
                      </Text>
                    </View>
                    <View style={styles.topicContent}>
                      <Text style={[styles.topicName, { color: colors.text }]}>{topic.topic}</Text>
                      <Text style={[styles.topicMeta, { color: colors.textTertiary }]}>
                        {formatNumber(topic.count)} mentions
                      </Text>
                    </View>
                    <View style={styles.topicTrend}>
                      <trendMeta.Icon size={14} color={trendColor} strokeWidth={2.5} />
                      <Text style={[styles.topicTrendText, { color: trendColor }]}>
                        {trendMeta.label}
                      </Text>
                    </View>
                    <ChevronRight size={16} color={colors.textTertiary} strokeWidth={2} />
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </Animated.View>

      {/* Top Stories */}
      <Animated.View entering={FadeInDown.delay(400).springify().damping(18)}>
        <Section
          title="Top Stories"
          onSeeAll={() => rootNav.navigate('Main', {
            screen: 'BrowseTab',
            params: { screen: 'BrowseHome' },
          })}
        >
          {MOCK_ARTICLES.slice(0, 4).map((article, index) => (
            <Animated.View key={article.id} entering={FadeInDown.delay(450 + index * 60).springify()}>
              <ArticleCard
                article={article}
                onPress={handleArticlePress}
                onLongPress={handleArticleLongPress}
              />
            </Animated.View>
          ))}
        </Section>
      </Animated.View>

      {/* Watchlist */}
      <Animated.View entering={FadeInDown.delay(500).springify().damping(18)}>
        <Section
          title="Your Watchlist"
          onSeeAll={() => rootNav.navigate('Main', {
            screen: 'BrowseTab',
            params: {
              screen: 'BrowseHome',
              params: { initialTab: 'Watchlist' },
            },
          })}
        >
          {MOCK_WATCHLIST.slice(0, 4).map((item, index) => {
            const label = getSentimentLabel(item.sentiment ?? 0);
            const sparkColor = label === 'positive' ? colors.success : label === 'negative' ? colors.danger : colors.primary;
            
            return (
              <Animated.View key={item.id} entering={FadeInDown.delay(550 + index * 50).springify()}>
                <Pressable
                  onPress={() => rootNav.navigate('Main', {
                    screen: 'BrowseTab',
                    params: {
                      screen: 'WatchlistDetail',
                      params: { itemId: item.id, name: item.name },
                    },
                  })}
                  style={({ pressed }) => [
                    styles.watchlistItem,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.watchlistIcon, { backgroundColor: colors.primary + '15' }]}>
                    <Bookmark size={16} color={colors.primary} strokeWidth={2} />
                  </View>
                  <View style={styles.watchlistContent}>
                    <Text style={[styles.watchlistName, { color: colors.text }]} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={[styles.watchlistMeta, { color: colors.textTertiary }]}>
                      {item.articleCount} articles
                    </Text>
                  </View>
                  <SparkLine
                    data={item.sparkData ?? [1, 2, 1.5, 3, 2.5]}
                    width={60}
                    height={24}
                    color={sparkColor}
                  />
                  <View style={[styles.watchlistSentiment, { backgroundColor: sparkColor + '15' }]}>
                    <Text style={[styles.watchlistSentimentText, { color: sparkColor }]}>
                      {(item.sentiment ?? 0) > 0 ? '+' : ''}{(item.sentiment ?? 0).toFixed(1)}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </Section>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  greeting: {
    fontFamily: fontFamily.sansBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  dateText: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  marketBanner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  marketBannerContent: {
    marginBottom: spacing.md,
  },
  marketBannerTitle: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 16,
    lineHeight: 22,
  },
  marketBannerSubtitle: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.xxs,
  },
  marketIndices: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  marketCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 0,
  },
  marketName: {
    fontFamily: fontFamily.sans,
    fontSize: 10,
    lineHeight: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.xxs,
  },
  marketValue: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: palette.white,
  },
  marketChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
  marketChange: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 10,
    lineHeight: 14,
  },
  statsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 17,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
  },
  statLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: fontFamily.sansBold,
    fontSize: 22,
    lineHeight: 28,
  },
  statChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: spacing.xs,
  },
  statChange: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  sentimentCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sentimentHeader: {
    marginBottom: spacing.md,
  },
  sentimentTitle: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  sentimentBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    gap: 2,
  },
  sentimentSegment: {
    height: '100%',
  },
  sentimentLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  sentimentLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentLabelText: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 14,
  },
  topicsSection: {
    marginBottom: spacing.lg,
  },
  topicsList: {
    gap: spacing.sm,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  topicRank: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicRankText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 12,
    lineHeight: 16,
  },
  topicContent: {
    flex: 1,
  },
  topicName: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  topicMeta: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  topicTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  topicTrendText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 11,
    lineHeight: 14,
  },
  watchlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  watchlistIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchlistContent: {
    flex: 1,
  },
  watchlistName: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  watchlistMeta: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  watchlistSentiment: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  watchlistSentimentText: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});
