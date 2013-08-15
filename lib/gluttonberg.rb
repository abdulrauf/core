module Gluttonberg
  require 'engine' if defined?(Rails) && Rails::VERSION::MAJOR >= 3
  require 'haml'
  require 'authlogic'
  require 'will_paginate'
  require 'zip/zip'
  require 'acts_as_tree'
  require 'acts_as_versioned'
  require 'paperclip'
  require 'cancan'
  require 'texticle'
  require 'audio_job'
  require 'aws'
  require 'acl9'
  require 'sidekiq'
  require 'sitemap_generator'
  require 'gluttonberg/components'
  require 'gluttonberg/content'
  require 'gluttonberg/drag_tree'
  require 'gluttonberg/extensions'
  require 'gluttonberg/library'
  require 'gluttonberg/page_description'
  require 'gluttonberg/templates'
  require 'gluttonberg/middleware'
  require 'gluttonberg/membership'
  require 'gluttonberg/can_flag'
  require 'gluttonberg/record_history'
  require 'gluttonberg/gb_file'
  require 'gluttonberg/random_string_generator'
  require 'gluttonberg/helpers/form_builder'


  # These should likely move into one of the initializers inside of the
  # engine config. This will ensure they only run after Rails and the app
  # has been loaded.
  DragTree.setup
  RecordHistory.setup

  # Check to see if Gluttonberg is configured to be localized.
  def self.localized?
    Engine.config.localize
  end

  def self.dbms_name
    if ActiveRecord::Base.configurations[Rails.env]
      adapter_name = ActiveRecord::Base.configurations[Rails.env]["adapter"]
      if ["mysql2" , "mysql"].include?(adapter_name)
        "mysql"
      else
        adapter_name.to_s
      end
    end
  end

  def self.like_or_ilike
    Gluttonberg.dbms_name == "postgresql" ? "ilike" : "like"
  end

  def self.next_migration_number(dirname)
    if ActiveRecord::Base.timestamped_migrations
      Time.now.utc.strftime("%Y%m%d%H%M%S")
    else
      "%.3d" % (current_migration_number(dirname) + 1)
    end
  end

  require 'jeditable-rails'
end


