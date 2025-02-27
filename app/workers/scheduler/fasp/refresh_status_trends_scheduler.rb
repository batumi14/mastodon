# frozen_string_literal: true

class Scheduler::Fasp::RefreshStatusTrendsScheduler
  include Sidekiq::Worker

  sidekiq_options retry: 0, lock: :until_executed, lock_ttl: 30.minutes.to_i

  def perform
    return unless Mastodon::Feature.fasp_enabled?

    trends_providers = Fasp::Provider.with_capability('trends')
    return if trends_providers.none?

    languages = User.signed_in_recently.pluck(Arel.sql('DISTINCT(unnest(chosen_languages))'))

    service = Fasp::RefreshStatusTrendsService.new

    languages.each do |language|
      trends_providers.each do |provider|
        service.call(provider, language)
      end
    end
  end
end
