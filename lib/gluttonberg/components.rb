module Gluttonberg
  # This module allows custom controllers to be registered wtih Gluttonberg’s
  # administration. Typically, these controllers will be registered in the
  # application’s before_app_loads block.
  module Components
    @@components  = {}
    @@routes      = {}
    @@nav_entries = nil
    @@main_nav_entries = []
    @@registered  = nil
    Component     = Struct.new(:name, :label , :admin_url, :only_for_super_admin )

    # Registers a controller — or set of controllers — based on the URLs
    # specified in the routes.
    #
    #   Components.register(:forum, :label => "Forum", :admin_url => url) do |scope|
    #     scope.resources(:posts)
    #     scope.resources(:threads)
    #   end
    def self.register(name, opts = {}, &routes)
      @@components[name] = opts
      @@routes[name] = routes if block_given?
    end


    # Returns a hash of the registered components, keyed to their label.
    def self.registered
      @@registered ||= @@components.collect {|k, v| Component.new(k.to_s, v[:label] , v[:only_for_super_admin])}
    end

    # Returns an array of components that have been given a nav_label —
    # the label implicitly registers them as nav entries. Components without
    # a label won’t turn up.
    def self.nav_entries(section_name="")
      temp = @@components.find_all{|k,v| (section_name.blank? && (!v.has_key?(:section_name) || v[:section_name].blank?)) || (!section_name.blank? && v[:section_name] == section_name) }
      nav_entries = temp.collect do |k, v|

        url = if v[:admin_url]
          if v[:admin_url].is_a? Symbol
            v[:admin_url]
          else
            v[:admin_url]
          end
        end
        [v[:label], k, url , v[:only_for_super_admin]]
      end
    end


   def self.register_for_main_nav(name , url , only_for_super_admin = false )
      @@main_nav_entries << [name , url , only_for_super_admin]
    end

   # Returns an array of components that have been given a nav_label —
    # the label implicitly registers them as nav entries. Components without
    # a label won’t turn up.
    def self.main_nav_entries
      @@main_nav_entries
    end


  end
end