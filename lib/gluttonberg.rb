module Gluttonberg
  require 'engine' if defined?(Rails) && Rails::VERSION::MAJOR >= 3
  require 'protected_attributes'
  require 'rails-observers'
  require 'haml'
  require 'authlogic'
  require 'will_paginate'
  require 'zip/zip'
  require 'acts_as_tree'
  require 'acts_as_versioned'
  require 'delayed_job'
  require 'paperclip'
  require 'cancan'
  require 'texticle'
  require 'audio_job'
  require 'aws'
  require 'acl9'
  require 'sitemap_generator'
  require 'gluttonberg/authorizable'
  require 'gluttonberg/components'
  require 'gluttonberg/content'
  require 'gluttonberg/drag_tree'
  require 'gluttonberg/extensions'
  require 'gluttonberg/library'
  require 'gluttonberg/page_description'
  require 'gluttonberg/templates'
  require 'gluttonberg/middleware'
  require 'gluttonberg/can_flag'
  require 'gluttonberg/record_history'

  # These should likely move into one of the initializers inside of the
  # engine config. This will ensure they only run after Rails and the app
  # has been loaded.
  DragTree.setup
  RecordHistory.setup

  # Check to see if Gluttonberg is configured to be localized.
  def self.localized?
    Engine.config.localize
  end

  require 'jeditable-rails'
end


