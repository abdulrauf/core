module Gluttonberg
  module Content
    # A mixin that will add simple publishing functionality to any arbitrary
    # model. This includes finders for retrieving published records and
    # instance methods for quickly changing the state.
    module Publishable
      # Add the class and instance methods, declare the property we store the
      # published state in.
      def self.included(klass)
        klass.class_eval do
          extend ClassMethods
          include InstanceMethods
          scope :published, lambda { where("state = 'published'  AND  published_at <= ?", Time.zone.now) }
          scope :archived, lambda { where(:state => "archived") }
          scope :draft, lambda { where(:state => "draft") }
          scope :non_published, lambda { where("state != 'published'") }
          before_validation :clean_published_date
        end
      end

      module ClassMethods
        # Returns all matching records that are published for a particular user. May be called
        # with additional conditions.
        def all_unpublished_for_user( user , options = {})
          if options[:conditions].blank?
             options[:conditions] = { :state => "published" }
          else
            options[:conditions][:state] = "published"
          end

          all(options)
        end

      end

      module InstanceMethods
        # Change the publish state to true and save the record.
        def publish!
          update_attributes(:state=>"published")
        end

        # Change the publish state to false and save the record.
        def unpublish!
          update_attributes(:state=>"draft")
        end

        # Change the publish state to draft but not save the record
        def unpublish
          assign_attributes(:state=>"draft")
        end

        # Change the publish state to true and save the record.
        def archive!
          update_attributes(:state=>"archived")
        end

        # Check to see if this record has been published.
        def published?
          self.state == "published" && published_at <= Time.zone.now
        end

        # Check to see if this record has been published.
        def archived?
          self.state == "archived"
        end

        def draft?
          self.state == "draft" || self.state == "ready" || self.state == "not_ready"
        end

        def publishing_status
          if draft?
            "Draft"
          else
            self.state.capitalize unless self.state.blank?
          end
        end

        def clean_published_date
          if self.state != "published"
            self.published_at = nil
          end
        end

      end
    end # Publishable
  end # Content
end # Gluttonberg
